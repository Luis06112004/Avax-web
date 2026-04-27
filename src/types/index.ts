export type Brand = {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  modelCount?: number;
  /** Color del pill de marca cuando se muestra sobre la imagen */
  pillColor?: string;
};

export type ProductBadge = "HOT" | "NEW" | "SALE";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  /** Texto del descuento, ej: "-30%" */
  discountLabel?: string;
  image: string;
  images?: string[];
  badge?: ProductBadge;
  rating?: number;
  reviewsCount?: number;
  stock?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  verified?: boolean;
  location?: string;
  /** Texto libre. Ej: "Compró hace 2 semanas" */
  purchasedAgo?: string;
};

export type InstagramPost = {
  id: string;
  image: string;
  link?: string;
};
