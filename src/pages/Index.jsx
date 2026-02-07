import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CrowdDashboard from "@/components/CrowdDashboard";
import QueueSystem from "@/components/QueueSystem";
import TempleMap from "@/components/TempleMap";
import EmergencyAlert from "@/components/EmergencyAlert";
import ServicesInfo from "@/components/ServicesInfo";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";

import { useLocation, useNavigate } from "react-router-dom";

const routeToSection = {
  "/": "home",
  "/crowd-monitor": "dashboard",
  "/queue": "queue",
  "/map": "navigation",
  "/emergency": "emergency",
  "/services": "services",
  "/analytics": "analytics",
};

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeSection = routeToSection[location.pathname] || "home";

  const handleSectionChange = (section) => {
    const sectionRoutes = {
      home: "/",
      dashboard: "/crowd-monitor",
      queue: "/queue",
      navigation: "/map",
      emergency: "/emergency",
      services: "/services",
      analytics: "/analytics",
    };

    navigate(sectionRoutes[section] || "/");
  };

  const handleGetStarted = () => {
    navigate("/crowd-monitor");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HeroSection onGetStarted={handleGetStarted} />;

      case "dashboard":
        return <CrowdDashboard />;

      case "queue":
        return <QueueSystem />;

      case "navigation":
        return <TempleMap />;

      case "emergency":
        return <EmergencyAlert />;

      case "services":
        return <ServicesInfo />;

      case "analytics":
        return <Analytics />;

      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div
        className={`flex-1 ${activeSection !== "home" ? "pt-20 md:pt-24" : ""}`}
      >
        {renderSection()}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
