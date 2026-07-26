-- Galería del producto: fotos sueltas además de la portada (products.image_url).
--
-- Va junto con products.variants (ver 20260726_add_product_variants.sql): cada
-- tono lleva su propia foto dentro del JSON de variants, y esta columna guarda
-- las fotos que NO pertenecen a un tono en particular (la tabla de tonos, el
-- empaque, la foto con modelo).
--
-- Forma: array de URLs públicas del bucket product-images.
--   ["https://.../products/1712345-abc.jpg", "https://.../products/1712346-def.jpg"]

alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;

comment on column public.products.images is
  'Fotos extra del producto (URLs), aparte de image_url y de la foto de cada tono en variants.';

alter table public.products
  drop constraint if exists products_images_is_array;

alter table public.products
  add constraint products_images_is_array
  check (jsonb_typeof(images) = 'array');

-- Rollback:
--   alter table public.products drop constraint if exists products_images_is_array;
--   alter table public.products drop column if exists images;
