import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderTemplate, TemplateError } from '@/lib/email-template';

/**
 * Los enlaces de la secuencia de bienvenida, comprobados en el HTML compilado.
 *
 * Existe por un fallo concreto: `s.markdown()` de Velite percent-codifica las
 * llaves cuando el placeholder va en el destino de un enlace, así que
 * `[Empezar]({{url_sitio}}/empieza-aqui)` compila a
 * `href="%7B%7Burl_sitio%7D%7D/empieza-aqui"`. Ni la sustitución ni el guard de
 * sobrantes casaban con esa forma, de modo que el email salía impecable con
 * todos sus botones muertos. Estuvo así del 2026-07-29 al 2026-08-21.
 *
 * Por eso la comprobación es sobre el HTML de Velite y no sobre el markdown: el
 * markdown siempre tuvo bien los enlaces. Lo que estaba mal era lo que salía del
 * compilador, que es lo único que ve el suscriptor.
 */

const COMPILADO = join(import.meta.dirname, '..', '.velite', 'sequenceEmails.json');

const SITIO = 'https://kata.ianexora.com';

/** Las mismas cuatro que pasa `renderStep` en src/lib/welcome-sequence.tsx. */
const VARS = {
  url_sitio: SITIO,
  nombre_sitio: 'Kata Ivanovych',
  apertura_personalizada: '',
  bloque_descarga: '',
};

interface PasoCompilado {
  key: string;
  sequence: string;
  draft: boolean;
  html: string;
}

function leerPasos(): PasoCompilado[] {
  if (!existsSync(COMPILADO)) {
    throw new Error(
      `Falta ${COMPILADO}. Este test lee la salida de Velite, no el markdown: ` +
        `corre \`npm run build:content\` antes de \`npm test\`.`,
    );
  }
  const todos = JSON.parse(readFileSync(COMPILADO, 'utf8')) as PasoCompilado[];
  return todos.filter((p) => p.sequence === 'bienvenida' && !p.draft);
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]!);
}

describe('enlaces de la secuencia de bienvenida', () => {
  const pasos = leerPasos();

  test('hay pasos que comprobar', () => {
    assert.ok(pasos.length > 0, 'sin pasos compilados este test no prueba nada');
  });

  for (const paso of pasos) {
    test(`${paso.key}: ningún enlace queda relativo ni codificado`, () => {
      const html = renderTemplate(paso.html, VARS);

      assert.ok(
        !html.includes('%7B%7B') && !html.includes('%7D%7D'),
        `${paso.key} conserva llaves percent-codificadas tras renderizar`,
      );
      assert.ok(!html.includes('{{'), `${paso.key} conserva un placeholder literal`);

      for (const href of hrefs(html)) {
        assert.ok(
          href.startsWith('https://') || href.startsWith('http://') || href.startsWith('mailto:'),
          `${paso.key}: href relativo "${href}". En un email no hay página desde la que resolverlo.`,
        );
      }
    });
  }

  test('los pasos con enlaces apuntan al dominio real', () => {
    const todos = pasos.flatMap((p) => hrefs(renderTemplate(p.html, VARS)));
    const delSitio = todos.filter((h) => h.startsWith(SITIO));
    assert.ok(
      delSitio.length >= 3,
      `solo ${delSitio.length} enlaces a ${SITIO}: la secuencia dejó de llevar a ninguna parte`,
    );
  });
});

describe('renderTemplate', () => {
  test('sustituye un placeholder percent-codificado dentro de un href', () => {
    const html = '<p><a href="%7B%7Burl_sitio%7D%7D/empieza-aqui">Empezar</a></p>';
    assert.equal(
      renderTemplate(html, { url_sitio: SITIO }),
      `<p><a href="${SITIO}/empieza-aqui">Empezar</a></p>`,
    );
  });

  test('lanza ante un nombre desconocido, también codificado', () => {
    assert.throws(
      () => renderTemplate('<a href="%7B%7Burl_sitiO%7D%7D/x">x</a>', { url_sitio: SITIO }),
      TemplateError,
      'un typo dentro de un enlace salía sin avisar: es el fallo que se corrigió',
    );
  });

  test('lanza ante un placeholder literal desconocido', () => {
    assert.throws(() => renderTemplate('<p>{{desglse}}</p>', { desglose: 'x' }), TemplateError);
  });

  test('un valor con $& no se corrompe', () => {
    // `$&` es especial en una cadena de reemplazo: sin replacer se convertiría
    // en el propio texto encontrado. Los valores llevan precios ($0.05), así
    // que esto es una mina, no una hipótesis.
    assert.equal(renderTemplate('<p>{{v}}</p>', { v: 'a$&b' }), 'a$&b');
  });
});
