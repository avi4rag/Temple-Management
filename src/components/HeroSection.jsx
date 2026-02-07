import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users, Clock, MapPin, Shield, TrendingUp, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/somnath-temple-hero.jpg";

const HeroSection = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: "Real-time Crowd Monitoring",
      description: "Live footfall tracking and density alerts",
      color: "bg-gradient-sacred",
    },
    {
      icon: Clock,
      title: "Smart Queue System",
      description: "Digital darshan tokens and wait time updates",
      color: "bg-gradient-temple",
    },
    {
      icon: MapPin,
      title: "Temple Navigation",
      description: "Indoor maps and optimized route guidance",
      color: "bg-gradient-divine",
    },
    {
      icon: Shield,
      title: "Emergency Management",
      description: "Panic alerts and evacuation assistance",
      color: "bg-destructive",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Crowd flow optimization insights",
      color: "bg-secondary",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Timely updates and service alerts",
      color: "bg-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">{t("hero.title")}</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {t("hero.subtitle")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-sacred hover:bg-gradient-divine shadow-divine text-lg px-8 py-6 transition-sacred"
              >
                {t("hero.getStarted")}
              </Button>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-divine text-lg px-8 py-6 transition-sacred"
                onClick={() => (window.location.href = "/admin/login")}
              >
                Admin Portal
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    2,847
                  </div>
                  <div className="text-sm text-gray-300">Current Devotees</div>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    15 min
                  </div>
                  <div className="text-sm text-gray-300">Avg Wait Time</div>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    Normal
                  </div>
                  <div className="text-sm text-gray-300">Crowd Status</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Temple Management Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced technology ensuring devotee safety, convenience, and
              spiritual serenity while maintaining the sacred atmosphere of
              Somnath
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-sacred transition-sacred group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-sacred`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
