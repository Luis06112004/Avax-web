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

export default async function Home() {
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
