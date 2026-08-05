-- Seed: rows for `public.resources`.
--
-- Not a migration: this is content, and it is applied by hand in the SQL editor
-- (project udluclqhfzdgvqpoezoo) after uploading the file to the private
-- `lead-magnets` bucket. Kept in the repo so the mapping between a file in
-- storage and the row that serves it is written down somewhere.
--
-- Order matters: upload first, then insert. A published row whose `file_path`
-- points at nothing signs a URL for a missing object and the reader gets a
-- broken download after confirming their email — the worst possible moment.
--
-- `file_path` is relative to the bucket root. Convention: <slug>/<filename>.

-- ---------------------------------------------------------------------------
-- 25 datos que tu equipo no debería copiar manualmente desde emails logísticos
-- Source: lead-magnets/25-datos-emails-logisticos/
-- Upload: 25-datos-emails-logisticos.pdf → lead-magnets/25-datos-emails-logisticos/
-- ---------------------------------------------------------------------------
insert into public.resources (slug, title, description, file_path, requires_email, published)
values (
  '25-datos-emails-logisticos',
  '25 datos que tu equipo no debería copiar manualmente desde emails logísticos',
  'Checklist de los 25 campos que se teclean a mano desde cada email de transporte, agrupados en 5 bloques, con un filtro de 3 preguntas para decidir cuáles automatizar primero.',
  '25-datos-emails-logisticos/25-datos-emails-logisticos.pdf',
  true,
  true
)
on conflict (slug) do update set
  title          = excluded.title,
  description    = excluded.description,
  file_path      = excluded.file_path,
  requires_email = excluded.requires_email,
  published      = excluded.published;

-- Comprobación: debe devolver una fila con published = true.
-- select slug, published, file_path, download_count from public.resources;
