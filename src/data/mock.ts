import type { Brand, Product, Testimonial, InstagramPost } from "@/types";

export const brands: Brand[] = [
  {
    id: "nike",
    name: "Nike",
    image: "",
    modelCount: 124,
    pillColor: "#1E1E1E",
  },
  {
    id: "nb",
    name: "New Balance",
    image: "",
    modelCount: 86,
    pillColor: "#C8102E",
  },
  {
    id: "adidas",
    name: "Adidas",
    image: "",
    modelCount: 97,
    pillColor: "#1E1E1E",
  },
];

export const popularProducts: Product[] = [
  {
    id: "p1",
    slug: "nike-air-max-sc",
    name: "Nike Air Max SC",
    brand: "NIKE",
    price: 349,
    oldPrice: 449,
    image: "",
    badge: "HOT",
    rating: 4.9,
  },
  {
    id: "p2",
    slug: "adidas-forum-low",
    name: "Adidas Forum Low",
    brand: "ADIDAS",
    price: 329,
    oldPrice: 399,
    image: "",
    rating: 4.8,
  },
  {
    id: "p3",
    slug: "nb-574",
    name: "New Balance 574",
    brand: "NEW BALANCE",
    price: 299,
    oldPrice: 359,
    image: "",
    rating: 4.7,
  },
];

export const featuredProducts: Product[] = [
  {
    id: "f1",
    slug: "nike-dunk-low",
    name: "Nike Dunk Low",
    brand: "NIKE",
    price: 379,
    oldPrice: 459,
    discountLabel: "-30%",
    image: "",
    rating: 4.9,
  },
  {
    id: "f2",
    slug: "nb-9060",
    name: "NB 9060",
    brand: "NEW BALANCE",
    price: 459,
    image: "",
    rating: 4.8,
  },
  {
    id: "f3",
    slug: "air-max-90",
    name: "Air Max 90",
    brand: "NIKE",
    price: 429,
    image: "",
    badge: "HOT",
    rating: 4.9,
  },
  {
    id: "f4",
    slug: "samba-og",
    name: "Samba OG",
    brand: "ADIDAS",
    price: 359,
    image: "",
    badge: "NEW",
    rating: 4.7,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Carlos Ramírez",
    rating: 5,
    comment:
      "Excelente atención y producto 100% original. Llegó antes de tiempo y el packaging premium. Volveré a comprar sin duda.",
    avatar: "",
    verified: true,
    location: "Lima",
    purchasedAgo: "Compró hace 2 semanas",
  },
  {
    id: "t2",
    name: "María López",
    rating: 5,
    comment:
      "La mejor tienda de zapatillas en Perú. Ya he comprado 3 veces y nunca decepciona. Atención top y envío rápido.",
    avatar: "",
    verified: true,
    location: "Arequipa",
    purchasedAgo: "Compró hace 1 mes",
  },
  {
    id: "t3",
    name: "Diego Paredes",
    rating: 5,
    comment:
      "Calidad premium y precios competitivos. El sistema de envíos y devoluciones funciona perfecto. 100% recomendado.",
    avatar: "",
    verified: true,
    location: "Trujillo",
    purchasedAgo: "Compró hace 3 días",
  },
];

export const instagramPosts: InstagramPost[] = [
  { id: "i1", image: "/images/lifestyle/ig-1.jpg" },
  { id: "i2", image: "/images/lifestyle/ig-2.jpg" },
  { id: "i3", image: "/images/lifestyle/ig-3.jpg" },
  { id: "i4", image: "/images/lifestyle/ig-4.jpg" },
  { id: "i5", image: "/images/lifestyle/ig-5.jpg" },
];
