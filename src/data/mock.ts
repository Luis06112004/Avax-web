import type { Brand, Product, Testimonial, InstagramPost } from "@/types";

export const brands: Brand[] = [
  { id: "nb", name: "New Balance", logo: "/images/brands/new-balance.svg" },
  { id: "nike", name: "Nike", logo: "/images/brands/nike.svg" },
  { id: "adidas", name: "Adidas", logo: "/images/brands/adidas.svg" },
];

export const popularProducts: Product[] = [
  { id: "p1", slug: "air-max-sc", name: "Nike Air Max SC", brand: "Nike", price: 349, image: "/images/products/p1.png", badge: "HOT" },
  { id: "p2", slug: "nb-574", name: "New Balance 574", brand: "New Balance", price: 299, image: "/images/products/p2.png" },
  { id: "p3", slug: "adidas-forum", name: "Adidas Forum Low", brand: "Adidas", price: 329, image: "/images/products/p3.png", badge: "NEW" },
];

export const featuredProducts: Product[] = [
  { id: "f1", slug: "air-jordan-3", name: "Air Jordan 3", brand: "Nike", price: 599, oldPrice: 699, image: "/images/products/f1.png", badge: "SALE" },
  { id: "f2", slug: "yeezy-350", name: "Yeezy Boost 350", brand: "Adidas", price: 899, image: "/images/products/f2.png" },
  { id: "f3", slug: "nb-9060", name: "New Balance 9060", brand: "New Balance", price: 459, image: "/images/products/f3.png" },
  { id: "f4", slug: "dunk-low", name: "Nike Dunk Low", brand: "Nike", price: 379, image: "/images/products/f4.png", badge: "HOT" },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Carlos R.", rating: 5, comment: "Excelente atención y los productos son originales. Llegó antes de lo esperado." },
  { id: "t2", name: "María L.", rating: 5, comment: "La mejor tienda de zapatillas en Perú, ya he comprado 3 veces y nunca decepciona." },
  { id: "t3", name: "Diego P.", rating: 4, comment: "Buena calidad y precios competitivos. Volveré a comprar pronto." },
];

export const instagramPosts: InstagramPost[] = [
  { id: "i1", image: "/images/lifestyle/ig-1.jpg" },
  { id: "i2", image: "/images/lifestyle/ig-2.jpg" },
  { id: "i3", image: "/images/lifestyle/ig-3.jpg" },
  { id: "i4", image: "/images/lifestyle/ig-4.jpg" },
  { id: "i5", image: "/images/lifestyle/ig-5.jpg" },
];
