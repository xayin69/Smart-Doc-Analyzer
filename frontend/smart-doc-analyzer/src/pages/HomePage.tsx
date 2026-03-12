import PublicPageLayout from "../home/PublicPageLayout";
import HeroSection from "../home/HeroSection";
import MethodsCarouselSection from "../home/MethodsCarouselSection";
import ModelsCarouselSection from "../home/ModelsCarouselSection";
import HomeFooter from "../home/HomeFooter";


export default function HomePage() {
  return (
    <PublicPageLayout>
      <HeroSection />
      <MethodsCarouselSection />
      <ModelsCarouselSection />
      <HomeFooter />
    </PublicPageLayout>
  );
}