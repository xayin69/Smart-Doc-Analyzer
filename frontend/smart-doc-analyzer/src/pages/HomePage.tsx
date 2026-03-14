import PublicPageLayout from "../home/PublicPageLayout";
import HeroSectionEnhanced from "../home/HeroSection";
import FeaturesGrid from "../home/Featuresgrid";
import StatsSection from "../home/Statssection";
import MethodsCarouselSection from "../home/MethodsCarouselSection";
import ModelsCarouselSection from "../home/ModelsCarouselSection";
import HowItWorks from "../home/Howitworks";
import UseCases from "../home/Usecases";
import HomeFooter from "../home/HomeFooter";
import { Vortex } from "../ui/vortex";

export default function HomePage() {
  return (
    <PublicPageLayout>
      {/* Vortex wraps all sections so the particle background covers the full page */}
      <Vortex
        backgroundColor="transparent"
        containerClassName="homepage-vortex-wrapper"
        particleCount={700}
      >
        <HeroSectionEnhanced />
        <FeaturesGrid />
        <StatsSection />
        <MethodsCarouselSection />
        <ModelsCarouselSection />
        <HowItWorks />
        <UseCases />
      </Vortex>

      {/* Footer sits outside the Vortex */}
      <HomeFooter />
    </PublicPageLayout>
  );
}