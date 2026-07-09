import { FeaturedDentistsSection } from "@/features/landing/ui/featured-dentists-section";
import { HeroSection } from "@/features/landing/ui/hero-section";
import { PageLayout } from "@/widgets/page-layout/page-layout";

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturedDentistsSection />
    </PageLayout>
  );
}
