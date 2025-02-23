import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ConversationsSection from "./ConversationsSection";
import GlobeSection from "./GlobeSection";
import CallToAction from "./CallToAction";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 relative">
      {/* Animated Gradient Background */}
      <div className="animated-gradient" />

      {/* Grid Background */}
      <div className="grid-background opacity-30" />

      <Navbar />
      <HeroSection />
      <GlobeSection />
      <ConversationsSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
