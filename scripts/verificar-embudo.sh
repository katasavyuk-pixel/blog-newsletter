#!/usr/bin/env bash
# Verificación del embudo contra producción.
#
# Pide el secreto una vez y no lo imprime nunca (`read -rs`), así que se puede
# ejecutar dentro de una sesión de Claude Code sin que el valor acabe en el
# contexto ni en el historial del shell.
#
#   bash scripts/verificar-embudo.sh [email-de-pruebas]
#
# Sin argumento usa nexoraprocesos+verif@gmail.com. Usa un alias con "+" para
# poder borrar la fila después: en `subscribers`, filtra por ese email.

set -uo pipefail

BASE="https://kata.ianexora.com"
CORREO="${1:-nexoraprocesos+verif@gmail.com}"
RECURSO="25-datos-emails-logisticos"

printf 'Secreto (NEWSLETTER_SEND_SECRET): '
read -rs SECRETO
echo
[ -z "$SECRETO" ] && { echo "Sin secreto, nada que hacer."; exit 1; }

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; FALLOS=$((FALLOS+1)); }
FALLOS=0

echo
echo "1. Páginas y JSON-LD ─────────────────────────────────────────"
node scripts/geo/audit-ssr.mjs "$BASE" > /tmp/geo-verif.txt 2>&1 \
  && ok "auditoría GEO sin problemas (12 tipos de página)" \
  || { bad "la auditoría GEO marca algo — mira /tmp/geo-verif.txt"; tail -20 /tmp/geo-verif.txt; }

echo
echo "2. Endpoints protegidos ──────────────────────────────────────"
for ruta in api/welcome-sequence/test api/newsletter/send; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/$ruta" \
        -H 'Content-Type: application/json' -d '{}')
  [ "$c" = "401" ] && ok "$ruta rechaza sin credenciales (401)" \
                   || bad "$ruta devuelve $c, esperaba 401"
done

echo
echo "3. La descarga exige email confirmado ────────────────────────"
r=$(curl -s -o /dev/null -w '%{redirect_url}' "$BASE/api/download?slug=$RECURSO")
[[ "$r" == *"need_email=$RECURSO"* ]] && ok "sin credenciales rebota y explica por qué" \
                                     || bad "esperaba rebote a need_email, dio: $r"
r=$(curl -s -o /dev/null -w '%{redirect_url}' \
      "$BASE/api/download?slug=$RECURSO&e=falso@x.com&exp=99999999999999&sig=deadbeef")
[[ "$r" == *"need_email"* ]] && ok "una firma inválida NO sirve el fichero" \
                            || bad "¡una firma falsa pasó! dio: $r"

echo
echo "4. Ensayo en seco del boletín ────────────────────────────────"
d=$(curl -s -X POST "$BASE/api/newsletter/send" \
      -H "Authorization: Bearer $SECRETO" -H 'Content-Type: application/json' \
      -d '{"issue":"2026-08-antes-del-tms","dryRun":true}')
echo "  respuesta: $d"
case "$d" in
  *'"dryRun":true'*) ok "el envío funciona y NO ha mandado nada" ;;
  *draft*)           ok "responde bien: la edición sigue en draft (esperado)" ;;
  *)                 bad "respuesta inesperada" ;;
esac

echo
echo "5. Secuencia de bienvenida a $CORREO ─────────────────────────"
s=$(curl -s -X POST "$BASE/api/welcome-sequence/test" \
      -H "Authorization: Bearer $SECRETO" -H 'Content-Type: application/json' \
      -d "{\"email\":\"$CORREO\",\"resource\":\"$RECURSO\"}")
enviados=$(printf '%s' "$s" | grep -o '"sent":true' | wc -l | tr -d ' ')
[ "$enviados" = "3" ] && ok "3 de 3 pasos enviados" \
                      || { bad "solo $enviados de 3 enviados"; echo "  $s"; }

cat <<'FIN'

─────────────────────────────────────────────────────────────────
Lo que falta ya no lo puede comprobar un script. En tu bandeja:

  [ ] Llegan 3 correos con asunto "[PRUEBA] …"
  [ ] El 1º trae la TABLA del desglose de costes y la fórmula
  [ ] Los 3 llevan "Cancelar suscripción" visible al pie
  [ ] El botón de descarga del 1º ABRE EL PDF pulsándolo desde Gmail
      ← este es el tramo que llevaba roto desde que se construyó
  [ ] Responder a cualquiera de ellos llega a un buzón que leas
      ← si no, el reply rate es cero por construcción

Ninguno de estos correos ha creado un suscriptor: el modo prueba no
escribe en la base de datos.
FIN

echo
[ "$FALLOS" -eq 0 ] && echo "Automático: todo verde." || echo "Automático: $FALLOS fallos."
exit $FALLOS
