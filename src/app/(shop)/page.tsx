import {
  Hero,
  BrandsBanner,
  PopularNow,
  PromoBanner,
  NewReleases,
  FeaturedProducts,
  Testimonials,
  InstagramFeed,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsBanner />
      <PopularNow />
      <PromoBanner />
      <NewReleases />
      <FeaturedProducts />
      <Testimonials />
      <InstagramFeed />
    </>
  );
}
