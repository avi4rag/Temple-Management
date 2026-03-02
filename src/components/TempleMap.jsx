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
  Headphones,
  Volume2,
} from "lucide-react";
import { audioTourService } from "@/services/audioTourService";

const TempleMap = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDirectionsPoi, setActiveDirectionsPoi] = useState(null);
  const [startingGate] = useState("Gate 2 (Digvijay Dwar)");
  const [playingMapAudioId, setPlayingMapAudioId] = useState(null);

  const toggleMapAudioTour = (chapterId) => {
    if (playingMapAudioId === chapterId) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingMapAudioId(null);
      return;
    }
    const chapter = audioTourService.getChapters().find((c) => c.id === chapterId);
    if (!chapter) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlayingMapAudioId(chapterId);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`${chapter.title.en}. ${chapter.summary.en}`);
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingMapAudioId(null);
      utterance.onerror = () => setPlayingMapAudioId(null);
      window.speechSynthesis.speak(utterance);
    }
    toast({
      title: `🎧 Playing Audio Guide: ${chapter.title.en}`,
      description: "Audio narration active. Tap again to stop.",
    });
  };

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
      audioTourId: "chandra-tapasya",
    },
    {
      id: "baan-stambh",
      name: "Baan Stambh (Arrow Pillar)",
      type: "heritage",
      icon: Compass,
      status: "Open",
      crowdLevel: "Low",
      description: "Historic arrow pillar on sea wall pointing straight to South Pole with zero landmass",
      timings: "Open 24 Hours",
      facilities: ["Ocean Viewpoint", "Sanskrit Plaque", "Audio Guide"],
      audioTourId: "baan-stambh",
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
    {
      id: "divyang-ramp",
      name: "Divyangjan Ramp & Wheelchair Hub",
      type: "accessibility",
      icon: Compass,
      status: "Open 24/7",
      crowdLevel: "Low",
      description: "Dedicated barrier-free gentle ramp with anti-skid floor leading to Sabha Mandapa",
      timings: "5:30 AM - 10:30 PM",
      facilities: ["Complimentary Wheelchairs", "Sevak Escort", "Tactile Paving", "Direct Lift"],
    },
    {
      id: "eco-cart-stand",
      name: "Eco-Cart & Shuttle Station",
      type: "parking",
      icon: Car,
      status: "Available",
      crowdLevel: "Low",
      description: "Zero-emission battery-operated buggies between Parking and Digvijay Dwar",
      timings: "6:00 AM - 10:00 PM",
      facilities: ["14-Seater Carts", "Priority for Elders", "Luggage Carrier"],
    },
    {
      id: "coastal-promenade",
      name: "Samudra Darshan Promenade & Baan Stambh",
      type: "coastal",
      icon: Compass,
      status: "Open (Observe Tide Flags)",
      crowdLevel: "Moderate",
      description: "Scenic seaside walkway overlooking the Arabian Sea and the sacred arrow pillar (Baan Stambh) pointing towards Antarctica.",
      timings: "5:30 AM - 9:30 PM",
      facilities: ["Baan Stambh Monument", "Safety Wave Barriers", "Marine Police Post", "Sunset Viewpoint", "Lifeguard Buoys"],
    },
    {
      id: "sea-rescue-post",
      name: "Coastal Marine Safety & Rescue Post",
      type: "medical",
      icon: ShieldAlert,
      status: "Active 24/7",
      crowdLevel: "Low",
      description: "Gujarat Maritime Board and Marine Police station equipped with life jackets, high-tide alert sirens, and rescue boats.",
      timings: "24/7",
      facilities: ["Lifejackets & Buoys", "Coastal Siren", "First Responder Unit", "High-Tide Megaphone Warning"],
    },
    {
      id: "veraval-shuttle-hub",
      name: "Veraval Railway Jn Free Shuttle Hub",
      type: "transport",
      icon: Car,
      status: "Buses Departing every 15 min",
      crowdLevel: "Low",
      description: "Dedicated zero-fare electric bus boarding station at Platform 1. Complimentary transport direct to Digvijay Dwar.",
      timings: "05:00 AM - 11:30 PM",
      facilities: ["Zero Fare", "Luggage Storage", "Priority Elder Seating", "Live GPS Tracking"],
    },
  ];

  const routes = [
    {
      name: "Veraval Railway Jn to Temple Electric Bus Transit",
      duration: "18 min",
      stops: ["Veraval Jn PF-1", "Bhadrakali Chowk", "Triveni Sangam", "Temple Digvijay Dwar"],
      crowdLevel: "Low",
      recommended: true,
    },
    {
      name: "Arabian Sea Coastal Promenade & Baan Stambh Walk",
      duration: "20 min",
      stops: ["South Gate", "Baan Stambh Monument", "Sea-Facing Parikrama", "Sunset Viewpoint"],
      crowdLevel: "Moderate",
      recommended: true,
    },
    {
      name: "🚨 Emergency Evacuation & Safe Assembly Route",
      duration: "3-5 min (Urgent)",
      stops: ["Sanctum Exit", "Sabha Mandapa Wide Flank", "Emergency Gate 3 (Sea Gate)", "North Lawn Assembly Point A"],
      crowdLevel: "Cleared Corridor",
      recommended: false,
      isEmergency: true,
      description: "Priority escape pathway demarcated with glow-in-the-dark floor arrows leading away from oceanfront to high ground.",
    },
    {
      name: "Barrier-Free Accessible Route (Seniors / Divyang)",
      duration: "10 min",
      stops: ["North Parking Eco-Cart", "Gate 1 Ramp Hub", "Sabha Mandapa Lift", "Sanctum Darshan"],
      crowdLevel: "Low",
      recommended: true,
    },
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
      case "accessibility":
        return "bg-emerald-600";
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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              const next = !showEvacuationRoutes;
              setShowEvacuationRoutes(next);
              if (next) setShowRoutes(true);
            }}
            className={`text-xs ${
              showEvacuationRoutes
                ? "bg-destructive text-white border-destructive shadow-md ring-2 ring-destructive/40 animate-pulse"
                : "border-destructive/40 text-destructive hover:bg-destructive/10"
            }`}
          >
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            {showEvacuationRoutes ? "Hide Evacuation Routes" : "🚨 Evacuation & Assembly Exits"}
          </Button>
          <Button
            onClick={() => setShowRoutes(!showRoutes)}
            className="bg-gradient-temple text-xs"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {showRoutes ? "Hide Routes" : "Show Routes"}
          </Button>
        </div>
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
                    aria-label="Veraval Railway Jn Free Shuttle Hub"
                    title="Veraval Jn Free Electric Shuttle Stand"
                    className="absolute top-4 left-18 px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 cursor-pointer hover:bg-emerald-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none text-[10px] font-semibold"
                    onClick={() => setSelectedPOI("veraval-shuttle-hub")}
                  >
                    🚌 Veraval Shuttle (6km)
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
                  <button
                    type="button"
                    aria-label="Divyangjan Ramp & Wheelchair Hub"
                    title="Divyangjan Gentle Ramp (Barrier-Free)"
                    className="absolute top-1/2 left-28 w-8 h-8 bg-emerald-300 text-emerald-950 font-bold rounded cursor-pointer hover:bg-emerald-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none text-xs"
                    onClick={() => setSelectedPOI("divyang-ramp")}
                  >
                    ♿
                  </button>
                  <button
                    type="button"
                    aria-label="Eco-Cart Shuttle Station"
                    title="Zero-Emission Eco Buggies"
                    className="absolute top-12 left-6 w-8 h-8 bg-amber-300 text-amber-950 font-bold rounded cursor-pointer hover:bg-amber-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none text-xs"
                    onClick={() => setSelectedPOI("eco-cart-stand")}
                  >
                    🛺
                  </button>

                  {/* Arabian Sea Coastal Border strip */}
                  <div className="absolute -bottom-2 inset-x-0 h-7 bg-gradient-to-t from-sky-500/25 to-transparent border-t border-sky-400/30 flex items-center justify-between px-3 text-[10px] text-sky-800 dark:text-sky-300 font-medium">
                    <span>🌊 Arabian Sea Coastal Promenade</span>
                    <span className="text-[9px] opacity-75">Baan Stambh 📍</span>
                  </div>

                  <button
                    type="button"
                    aria-label="Samudra Darshan Coastal Promenade"
                    title="Samudra Darshan & Baan Stambh"
                    className="absolute bottom-1 left-28 w-8 h-8 bg-sky-300 text-sky-950 font-bold rounded cursor-pointer hover:bg-sky-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none text-xs z-10"
                    onClick={() => setSelectedPOI("coastal-promenade")}
                  >
                    🌊
                  </button>
                  <button
                    type="button"
                    aria-label="Coastal Marine Safety Post"
                    title="Marine Safety & Rescue Post"
                    className="absolute bottom-1 right-28 w-8 h-8 bg-cyan-300 text-cyan-950 font-bold rounded cursor-pointer hover:bg-cyan-400 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus:outline-none text-xs z-10"
                    onClick={() => setSelectedPOI("sea-rescue-post")}
                  >
                    🛟
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

                  {/* Emergency Evacuation Overlays */}
                  {showEvacuationRoutes && (
                    <>
                      {/* Emergency Exit Corridor Arrows */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                          </marker>
                        </defs>
                        {/* Evacuation Route from Sanctum to North-West Exit 3 */}
                        <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4" markerEnd="url(#arrow)" />
                        {/* Evacuation Route from Mandapa to East Exit 4 */}
                        <line x1="50%" y1="40%" x2="80%" y2="30%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4" markerEnd="url(#arrow)" />
                        {/* High Ground Route away from Sea */}
                        <line x1="50%" y1="75%" x2="20%" y2="85%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4" markerEnd="url(#arrow)" />
                      </svg>

                      {/* Assembly Point A Badge (North Lawn) */}
                      <div className="absolute top-4 left-6 z-30 bg-emerald-700 text-white px-2 py-1 rounded shadow-lg border border-emerald-300 text-[10px] font-bold animate-bounce flex items-center gap-1">
                        <span>🟢 ASSEMBLY POINT A</span>
                        <span className="text-[9px] opacity-80">(Cap: 5k)</span>
                      </div>

                      {/* Assembly Point B Badge (High Ground Helipad) */}
                      <div className="absolute top-4 right-6 z-30 bg-emerald-700 text-white px-2 py-1 rounded shadow-lg border border-emerald-300 text-[10px] font-bold animate-bounce flex items-center gap-1">
                        <span>🟢 ASSEMBLY POINT B</span>
                        <span className="text-[9px] opacity-80">(Cap: 8k)</span>
                      </div>

                      {/* Emergency Gate 3 Tag */}
                      <div className="absolute top-1/4 left-2 z-30 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                        EMERGENCY EXIT 3 ➔
                      </div>

                      {/* Emergency Gate 4 Tag */}
                      <div className="absolute top-1/3 right-2 z-30 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                        EMERGENCY EXIT 4 ➔
                      </div>

                      {/* Emergency Header Banner */}
                      <div className="absolute top-2 inset-x-12 z-20 bg-red-600/90 text-white text-center py-0.5 px-2 rounded-full text-[10px] font-bold tracking-wide shadow-md">
                        ⚠️ EMERGENCY EVACUATION CORRIDORS ACTIVE • PROCEED CALMLY TO ASSEMBLY POINTS
                      </div>
                    </>
                  )}
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
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span>Barrier-Free Ramp ♿</span>
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
                { id: "accessibility", label: "Access ♿" },
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
                            {poi.audioTourId && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMapAudioTour(poi.audioTourId);
                                }}
                                className={`w-full text-xs flex items-center justify-center mb-2 ${
                                  playingMapAudioId === poi.audioTourId
                                    ? "bg-destructive text-destructive-foreground animate-pulse"
                                    : "bg-amber-600 hover:bg-amber-700 text-white"
                                }`}
                              >
                                <Headphones className="w-3.5 h-3.5 mr-1.5" />
                                {playingMapAudioId === poi.audioTourId
                                  ? "Stop Audio Guide"
                                  : "Play Sacred Audio Chronicle"}
                              </Button>
                            )}

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
            }))}
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
