-- Tonos / variantes de producto (maquillaje: mismo producto, distinta tonalidad).
--
-- Se guardan como JSONB en la misma fila del producto en vez de una tabla
-- aparte: el catálogo hace `select *` sobre products en todos lados, así que
-- esto evita joins, RLS nueva y refactor de queries. Los productos que no
-- manejan tonos quedan con `[]` y siguen funcionando igual que antes.
--
-- Forma de cada elemento del array:
--   { "id": "uuid", "name": "Rosa Nude", "hex": "#C98A7A", "stock": 5 }
--   - id:    identificador estable, lo genera el panel admin
--   - name:  obligatorio, lo que ve el cliente y va en el mensaje de WhatsApp
--   - hex:   opcional (null), color del swatch en el catálogo
--   - stock: unidades de ESE tono
--
-- Regla de negocio (la aplica la app, no la base): si `variants` no está vacío,
-- `products.stock` es la suma del stock de los tonos.

alter table public.products
  add column if not exists variants jsonb not null default '[]'::jsonb;

comment on column public.products.variants is
  'Tonos/variantes del producto: [{id, name, hex, stock}]. Vacío = producto sin tonos. Si no está vacío, products.stock es la suma de los stock de cada tono.';

-- Blinda la columna contra un objeto suelto o un string; el resto de la forma
-- lo valida la app antes de escribir.
alter table public.products
  drop constraint if exists products_variants_is_array;

alter table public.products
  add constraint products_variants_is_array
  check (jsonb_typeof(variants) = 'array');

-- Rollback:
--   alter table public.products drop constraint if exists products_variants_is_array;
--   alter table public.products drop column if exists variants;
