export type Brand = {
  id: string;
  name: string;
  logo: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  badge?: "NEW" | "SALE" | "HOT";
  rating?: number;
  stock?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
};

export type InstagramPost = {
  id: string;
  image: string;
  link?: string;
};
