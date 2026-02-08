import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { CTASection } from "@/components/home/CTASection";
import { VoiceAssistant } from "@/components/ai/VoiceAssistant";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PartnersCarousel />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsCarousel />
        <CTASection />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Index;
