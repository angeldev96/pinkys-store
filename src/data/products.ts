export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'maquillaje' | 'joyeria' | 'perfumes' | 'accesorios';
  image: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Labial Mate Velvet Rose",
    price: 24.99,
    category: "maquillaje",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    badge: "Nuevo"
  },
  {
    id: 2,
    name: "Collar Perlas Elegance",
    price: 89.99,
    category: "joyeria",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    badge: "Bestseller"
  },
  {
    id: 3,
    name: "Perfume Floral Dreams",
    price: 129.99,
    category: "perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Paleta Sombras Aurora",
    price: 45.99,
    category: "maquillaje",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
    badge: "Oferta"
  },
  {
    id: 5,
    name: "Aretes Cristal Dorado",
    price: 39.99,
    category: "joyeria",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Perfume Midnight Bloom",
    price: 149.99,
    category: "perfumes",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    badge: "Premium"
  },
  {
    id: 7,
    name: "Rubor Durazno Glow",
    price: 28.99,
    category: "maquillaje",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=400&fit=crop"
  },
  {
    id: 8,
    name: "Pulsera Charm Delicado",
    price: 55.99,
    category: "joyeria",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
    badge: "Nuevo"
  },
  {
    id: 9,
    name: "Set Brochas Profesional",
    price: 79.99,
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop"
  },
  {
    id: 10,
    name: "Perfume Citrus Fresh",
    price: 95.99,
    category: "perfumes",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    id: 11,
    name: "Anillo Piedra Luna",
    price: 69.99,
    category: "joyeria",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    badge: "Bestseller"
  },
  {
    id: 12,
    name: "Espejo Compacto LED",
    price: 34.99,
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  }
];

export type CartItem = Product & { quantity: number };
