import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Navigation,
  Car,
  Utensils,
  Building,
  ShoppingBag,
  Phone,
  Heart,
  Info,
  Clock,
  Users,
  Search,
  Compass,
  Footprints,
  ArrowRight,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";

const TempleMap = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDirectionsPoi, setActiveDirectionsPoi] = useState(null);
  const [startingGate] = useState("Gate 2 (Digvijay Dwar)");

  const pointsOfInterest = [
    {
      id: "main-temple",
      name: "Main Temple",
      type: "temple",
      icon: MapPin,
      status: "Open",
      crowdLevel: "High",
      description: "Sacred Jyotirlinga shrine of Lord Shiva",
      timings: "6:00 AM - 10:00 PM",
      facilities: [
        "Darshan",
        "Aarti (7AM, 12PM, 7PM)",
        "Wheelchairs",
        "Golf Carts",
        "Lift",
      ],
    },
    {
      id: "parking-north",
      name: "North Parking",
      type: "parking",
      icon: Car,
      status: "Available",
      crowdLevel: "Low",
      description: "Main parking area for cars and buses",
      capacity: "500 vehicles",
      facilities: ["Security", "Lighting", "CCTV"],
    },
    {
      id: "prasad-counter",
      name: "Prasad Counter",
      type: "food",
      icon: Utensils,
      status: "Open",
      crowdLevel: "Moderate",
      description: "Official temple prasad distribution",
      timings: "6:00 AM - 10:00 PM",
      facilities: ["Prasad", "Holy Water", "Sweets"],
    },
    {
      id: "restrooms",
      name: "Public Restrooms",
      type: "facility",
      icon: Building,
      status: "Available",
      crowdLevel: "Low",
      description: "Clean sanitation facilities",
      facilities: ["Men", "Women", "Disabled Access"],
    },
    {
      id: "gift-shop",
      name: "Temple Store",
      type: "shopping",
      icon: ShoppingBag,
      status: "Open",
      crowdLevel: "Low",
      description: "Religious items and souvenirs",
      timings: "6:00 AM - 10:00 PM",
      facilities: ["Books", "Idols", "Rudraksha"],
    },
    {
      id: "medical-center",
      name: "Medical Center",
      type: "medical",
      icon: Heart,
      status: "24/7",
      crowdLevel: "Low",
      description: "Emergency medical assistance",
      facilities: ["First Aid", "Ambulance", "Doctor on Call"],
    },
    {
      id: "info-center",
      name: "Information Center",
      type: "info",
      icon: Info,
      status: "Open",
      crowdLevel: "Low",
      description: "Pilgrim assistance and guidance",
      timings: "6:00 AM - 10:00 PM",
      facilities: [
        "Maps",
        "Guidance",
        "Lost & Found",
        "Light & Sound Show Info",
      ],
    },
    {
      id: "light-sound-show",
      name: "Light & Sound Show",
      type: "entertainment",
      icon: Info,
      status: "8PM-9PM",
      crowdLevel: "Moderate",
      description: '"Jay Somnath" - Temple history through light and sound',
      timings: "8:00 PM - 9:00 PM (Except monsoon)",
      facilities: ["History Show", "Multilingual", "Seating", "Audio Guide"],
    },
  ];

  const routes = [
    {
      name: "Express Darshan Route",
      duration: "15 min",
      stops: ["North Gate", "Main Temple", "Exit Gate"],
      crowdLevel: "High",
      recommended: true,
    },
    {
      name: "Complete Temple Tour",
      duration: "45 min",
      stops: [
        "North Gate",
        "Information",
        "Main Temple",
        "Prasad Counter",
        "Temple Store",
        "Exit",
      ],
      crowdLevel: "Moderate",
      recommended: false,
    },
    {
      name: "Peaceful Route",
      duration: "30 min",
      stops: ["South Gate", "Garden Path", "Main Temple", "South Exit"],
      crowdLevel: "Low",
      recommended: true,
    },
  ];

  const getCrowdColor = (level) => {
    switch (level) {
      case "Low":
        return "bg-success";
      case "Moderate":
        return "bg-warning";
      case "High":
        return "bg-orange-500";
      default:
        return "bg-muted";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "temple":
        return "bg-gradient-sacred";
      case "parking":
        return "bg-secondary";
      case "food":
        return "bg-orange-500";
      case "facility":
        return "bg-accent";
      case "shopping":
        return "bg-purple-500";
      case "medical":
        return "bg-destructive";
      case "info":
        return "bg-blue-500";
      case "entertainment":
        return "bg-indigo-500";
      default:
        return "bg-muted";
    }
  };

  const filteredPOIs = pointsOfInterest.filter((poi) => {
    const matchesCategory =
      selectedCategory === "all" || poi.type === selectedCategory;
    const matchesSearch =
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.facilities?.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Temple Navigation
          </h1>
          <p className="text-muted-foreground">
            Interactive map with optimized routes and real-time updates
          </p>
        </div>
        <Button
          onClick={() => setShowRoutes(!showRoutes)}
          className="bg-gradient-temple"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {showRoutes ? "Hide Routes" : "Show Routes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-divine">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Temple Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg p-4 h-96 overflow-hidden">
              <div className="relative w-full h-full">
                <div className="absolute inset-4 border-2 border-muted-foreground/30 rounded-lg bg-green-50/30">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-16 h-16 bg-gradient-sacred rounded-lg shadow-sacred cursor-pointer hover:scale-105 transition-transform flex items-center justify-center relative"
                      onClick={() => setSelectedPOI("main-temple")}
                    >
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-foreground whitespace-nowrap">
                        Sanctum
                      </div>
                    </div>

                    <div className="absolute -top-8 -left-6 w-28 h-12 bg-orange-200 rounded border-2 border-orange-300 flex items-center justify-center">
                      <span className="text-xs font-medium">Mandapa</span>
                    </div>

                    <div className="absolute -top-12 -left-12 w-40 h-40 border-2 border-dashed border-primary/40 rounded-full" />
                  </div>

                  <button
                    type="button"
                    aria-label="North Gate"
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-secondary rounded cursor-pointer hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("main-temple")}
                  >
                    <span className="text-xs absolute -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      North Gate
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="South Gate"
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-secondary rounded cursor-pointer hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("main-temple")}
                  >
                    <span className="text-xs absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      South Gate
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="North Parking Area"
                    className="absolute top-4 left-4 w-12 h-8 bg-blue-200 rounded border cursor-pointer hover:bg-blue-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("parking-north")}
                  >
                    <Car className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="East Parking Area"
                    className="absolute top-4 right-4 w-12 h-8 bg-blue-200 rounded border cursor-pointer hover:bg-blue-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("parking-north")}
                  >
                    <Car className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Prasad Counter"
                    className="absolute bottom-12 left-6 w-8 h-8 bg-orange-300 rounded cursor-pointer hover:bg-orange-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("prasad-counter")}
                  >
                    <Utensils className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Temple Store and Gift Shop"
                    className="absolute bottom-12 right-6 w-8 h-8 bg-purple-300 rounded cursor-pointer hover:bg-purple-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("gift-shop")}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Public Restrooms"
                    className="absolute top-16 right-12 w-8 h-8 bg-green-300 rounded cursor-pointer hover:bg-green-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("restrooms")}
                  >
                    <Building className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Medical Center"
                    className="absolute bottom-4 left-16 w-8 h-8 bg-red-300 rounded cursor-pointer hover:bg-red-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("medical-center")}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Information Center"
                    className="absolute top-4 left-20 w-8 h-8 bg-blue-300 rounded cursor-pointer hover:bg-blue-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("info-center")}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Light and Sound Show"
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-300 rounded cursor-pointer hover:bg-indigo-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                    onClick={() => setSelectedPOI("light-sound-show")}
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <div
                    className="absolute top-1/2 left-8 w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg"
                    title="High Crowd Area"
                  />
                  <div
                    className="absolute top-1/2 right-8 w-3 h-3 bg-success rounded-full animate-pulse shadow-lg"
                    title="Low Crowd Area"
                  />
                  <div
                    className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-warning rounded-full animate-pulse shadow-lg"
                    title="Moderate Crowd Area"
                  />
                </div>

                <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm p-2 rounded text-xs space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-sacred rounded-full" />
                    <span>Main Temple</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span>High Crowd</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span>Low Crowd</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">Points of Interest</CardTitle>
              <Badge variant="outline" className="text-xs">
                {filteredPOIs.length} locations
              </Badge>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search spots, lockers, prasad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {[
                { id: "all", label: "All" },
                { id: "temple", label: "Temple" },
                { id: "parking", label: "Parking" },
                { id: "food", label: "Prasad" },
                { id: "medical", label: "Medical" },
                { id: "facility", label: "Facilities" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPOIs.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No locations match your filter.
              </div>
            ) : (
              filteredPOIs.map((poi) => {
              const Icon = poi.icon;
              return (
                <div
                  key={poi.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPOI === poi.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() =>
                    setSelectedPOI(selectedPOI === poi.id ? null : poi.id)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 ${getTypeColor(poi.type)} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground truncate">
                          {poi.name}
                        </h4>
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {poi.status}
                          </Badge>
                          <Badge
                            className={`${getCrowdColor(poi.crowdLevel)} text-white text-xs`}
                          >
                            {poi.crowdLevel}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {poi.description}
                      </p>

                      {selectedPOI === poi.id && (
                        <div className="mt-3 space-y-2">
                          {poi.timings && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {poi.timings}
                            </div>
                          )}
                          {poi.capacity && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Car className="w-3 h-3 mr-1" />
                              {poi.capacity}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {poi.facilities?.map((facility, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {facility}
                              </Badge>
                            ))}
                          </div>

                          <div className="pt-2 border-t mt-3">
                            <Button
                              size="sm"
                              variant={activeDirectionsPoi === poi.id ? "default" : "outline"}
                              className="w-full text-xs flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDirectionsPoi(
                                  activeDirectionsPoi === poi.id ? null : poi.id,
                                );
                              }}
                            >
                              <Footprints className="w-3.5 h-3.5 mr-1.5" />
                              {activeDirectionsPoi === poi.id
                                ? "Hide Walking Route"
                                : "Get Walking Directions"}
                            </Button>

                            {activeDirectionsPoi === poi.id && (
                              <div className="mt-3 p-3 bg-muted/80 rounded-lg space-y-2 text-xs border border-border">
                                <div className="flex items-center justify-between font-semibold text-foreground">
                                  <span className="flex items-center">
                                    <Compass className="w-3.5 h-3.5 mr-1 text-primary" />
                                    From {startingGate}
                                  </span>
                                  <span className="text-primary font-mono font-bold">
                                    ~3 min (180m)
                                  </span>
                                </div>
                                <div className="space-y-1.5 text-muted-foreground pt-1">
                                  <div className="flex items-start space-x-1.5">
                                    <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <span>Proceed straight past Digvijay Dwar security checkpoint.</span>
                                  </div>
                                  <div className="flex items-start space-x-1.5">
                                    <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <span>Follow marked yellow pathway towards {poi.name} (Ramp access).</span>
                                  </div>
                                  <div className="flex items-start space-x-1.5">
                                    <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="font-medium text-foreground">
                                      Arrive at {poi.name} entrance.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {showRoutes && (
        <Card className="shadow-sacred">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Recommended Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    route.recommended
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">
                      {route.name}
                    </h4>
                    {route.recommended && (
                      <Badge className="bg-gradient-sacred text-primary-foreground">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Duration: {route.duration}
                      </span>
                      <Badge
                        className={`${getCrowdColor(route.crowdLevel)} text-white text-xs`}
                      >
                        {route.crowdLevel} crowd
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <strong>Route:</strong> {route.stops.join(" → ")}
                    </div>
                  </div>

                  <Button
                    variant={route.recommended ? "default" : "outline"}
                    className={`w-full ${route.recommended ? "bg-gradient-sacred" : ""}`}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Navigation
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-temple">
        <CardHeader>
          <CardTitle>Live Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm">
                North parking has 150+ available spaces
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span className="text-sm">
                Main temple area experiencing moderate crowd
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm">
                Prasad counter queue: ~8 minute wait
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sacred border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center text-foreground">
            <LifeBuoy className="w-5 h-5 mr-2 text-primary" />
            On-Ground Pilgrim Assistance & Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/60 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Temple Control Room</span>
                <span className="font-semibold text-sm font-mono">+91 2876 231200</span>
              </div>
              <a
                href="tel:02876231200"
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full text-primary transition-colors"
                title="Call Control Room"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-muted/60 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Dispensary & First Aid</span>
                <span className="font-semibold text-sm">Gate 1 (24/7 Paramedic)</span>
              </div>
              <a
                href="tel:108"
                className="p-2 bg-destructive/10 hover:bg-destructive/20 rounded-full text-destructive transition-colors"
                title="Emergency Ambulance 108"
              >
                <Heart className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 bg-muted/60 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Elderly / Differently-Abled</span>
                <span className="font-semibold text-sm">Battery Cart Escort</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  toast({
                    title: "Escort Requested",
                    description: "Volunteer team alerted for Gate 2 Digvijay Dwar pickup.",
                  });
                }}
              >
                Request Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TempleMap;
