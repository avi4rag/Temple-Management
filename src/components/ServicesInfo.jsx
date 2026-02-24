import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Hotel,
  Utensils,
  MapPin,
  Clock,
  Phone,
  DollarSign,
  Star,
  MapIcon,
  Package,
  Info,
  Navigation,
  ShoppingBag,
  Train,
  Bus,
  Plane,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QrCode, Lock, CheckCircle, BatteryCharging } from "lucide-react";
import { donationService } from "@/services/donationService";
import { shuttleService } from "@/services/shuttleService";

const ServicesInfo = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("accommodation");
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [lockerToken, setLockerToken] = useState(null);
  const [mobilityToken, setMobilityToken] = useState(null);
  const [shuttleFleet] = useState(shuttleService.getFleetStatus());
  const [selectedShuttleBus, setSelectedShuttleBus] = useState(null);
  const [showShuttleModal, setShowShuttleModal] = useState(false);
  const [shuttlePassData, setShuttlePassData] = useState({
    passengerName: "",
    passengersCount: 2,
    trainNumber: "19218 Saurashtra Janta Exp",
    pickupStop: "Veraval Railway Junction (PF 1 Exit)",
    dropStop: "Shree Somnath Mandir Digvijay Dwar",
  });
  const [issuedShuttlePass, setIssuedShuttlePass] = useState(null);

  const [selectedCause, setSelectedCause] = useState(null);
  const [donationAmount, setDonationAmount] = useState(1100);
  const [donorDetails, setDonorDetails] = useState({
    name: "",
    phone: "",
    pan: "",
    email: "",
  });
  const [donationReceipt, setDonationReceipt] = useState(null);
  const [isDonating, setIsDonating] = useState(false);
  const causes = donationService.getDonationCauses();

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donorDetails.name.trim() || !donorDetails.phone.trim()) {
      toast({
        title: "Required Information",
        description: "Please enter your name and contact phone number.",
        variant: "destructive",
      });
      return;
    }
    if (donationAmount < 101) {
      toast({
        title: "Minimum Daan",
        description: "Minimum devotional offering is ₹101.",
        variant: "destructive",
      });
      return;
    }
    setIsDonating(true);
    try {
      const receipt = await donationService.recordDonation({
        causeId: selectedCause.id,
        causeTitle: selectedCause.title,
        amount: Number(donationAmount),
        donorName: donorDetails.name.trim(),
        donorPhone: donorDetails.phone.trim(),
        donorPan: donorDetails.pan.trim().toUpperCase(),
        donorEmail: donorDetails.email.trim(),
      });
      setDonationReceipt(receipt);
      toast({
        title: "Har Har Mahadev!",
        description: `Sacred daan of ₹${Number(donationAmount).toLocaleString()} received. Receipt #${receipt.receiptNo}`,
      });
    } catch {
      toast({
        title: "Payment Error",
        description: "Unable to process digital daan at this time.",
        variant: "destructive",
      });
    } finally {
      setIsDonating(false);
    }
  };

  const poojaSevas = [
    {
      id: "mahapuja",
      name: "Somnath Maha Puja",
      duration: "45 mins",
      samagri: "Included",
      dakshina: "₹1,100",
      description: "Comprehensive 16-upachara Vedic archana performed by sanctum priests with holy bilva patra.",
      timings: "Daily: 7:30 AM & 12:30 PM",
    },
    {
      id: "rudrabhishek",
      name: "Laghu Rudra Abhishek",
      duration: "90 mins",
      samagri: "Included",
      dakshina: "₹2,500",
      description: "Sacred continuous panchamrut abhishek with 11 recitations of Sri Rudram for divine health and peace.",
      timings: "Morning: 8:00 AM - 10:00 AM",
    },
    {
      id: "dhwajarohan",
      name: "Dhwajarohan (Flag Offering)",
      duration: "30 mins",
      samagri: "Included",
      dakshina: "₹5,100",
      description: "Ceremonial sacred flag hoisted at the 155-foot gold Kalash Shikhar of Somnath Temple.",
      timings: "Daily: 9:00 AM, 12:00 PM, 5:00 PM",
    },
    {
      id: "bilvapuja",
      name: "Sahasra Bilva Patra Archana",
      duration: "40 mins",
      samagri: "Included",
      dakshina: "₹500",
      description: "Offering of 1,008 fresh holy Bilva leaves with chanting of 108 names of Lord Somnath.",
      timings: "Daily: 6:30 AM - 11:30 AM",
    },
  ];

  const accommodations = [
    {
      id: 1,
      name: "Sagar Darshan Guest House",
      category: "5-Star Trust",
      rating: 4.8,
      price: "₹3,500 - ₹8,000",
      distance: "0.2 km from temple",
      amenities: ["WiFi", "AC", "Sea View", "Restaurant", "Parking"],
      description: "Official temple trust luxury sea-facing guest house right on the Arabian Sea shore",
      phone: "+91 2876 231200",
      image: "🏨",
    },
    {
      id: 2,
      name: "Maheshwari Guest House",
      category: "Deluxe Trust",
      rating: 4.5,
      price: "₹1,200 - ₹2,500",
      distance: "0.8 km from temple",
      amenities: ["WiFi", "AC", "Dining Hall", "Parking"],
      description: "Comfortable trust-managed family accommodation near Somnath bypass",
      phone: "+91 2876 231212",
      image: "🏩",
    },
    {
      id: 3,
      name: "Lilavati Atithi Bhavan",
      category: "Budget Trust",
      rating: 4.3,
      price: "₹500 - ₹1,200",
      distance: "1.2 km from temple",
      amenities: ["Clean Rooms", "Fan/AC", "Lift", "Common Canteen"],
      description: "Affordable and peaceful accommodation managed by Shree Somnath Trust",
      phone: "+91 2876 233533",
      image: "🏢",
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Somnath Temple Restaurant",
      category: "Vegetarian",
      rating: 4.6,
      cuisine: "Indian, Gujarati",
      price: "₹300 - ₹600",
      hours: "6:00 AM - 10:00 PM",
      speciality: "Temple Prasad, Thali, Khichdi",
      image: "🍛",
    },
    {
      id: 2,
      name: "Divine Dine",
      category: "Multi-Cuisine",
      rating: 4.4,
      cuisine: "Indian, Chinese, Continental",
      price: "₹500 - ₹1,200",
      hours: "7:00 AM - 11:00 PM",
      speciality: "North Indian, Street Food",
      image: "🍜",
    },
    {
      id: 3,
      name: "Shiva's Kitchen",
      category: "Pure Vegetarian",
      rating: 4.7,
      cuisine: "Indian, Gujarati, Rajasthani",
      price: "₹200 - ₹500",
      hours: "5:30 AM - 9:00 PM",
      speciality: "Home-cooked meals, Breakfast",
      image: "🥘",
    },
  ];

  const attractions = [
    {
      id: 1,
      name: "Triveni Sangam Beach",
      type: "Natural Attraction",
      distance: "2 km",
      rating: 4.5,
      description: "Beautiful beach where three rivers meet",
      timings: "6:00 AM - 6:00 PM",
      entryFee: "Free",
    },
    {
      id: 2,
      name: "Somnath Museum",
      type: "Museum",
      distance: "1 km",
      rating: 4.3,
      description: "Museum showcasing temple history and artifacts",
      timings: "10:30 AM - 5:30 PM",
      entryFee: "₹50",
    },
    {
      id: 3,
      name: "Light & Sound Show",
      type: "Entertainment",
      distance: "0.5 km",
      rating: 4.7,
      description: '"Jay Somnath" - Temple history through light and sound',
      timings: "8:00 PM - 9:00 PM (Daily except monsoon)",
      entryFee: "₹100 - ₹200",
    },
    {
      id: 4,
      name: "Veraval Harbor",
      type: "Cultural Site",
      distance: "4 km",
      rating: 4.2,
      description: "Active fishing port with traditional boats",
      timings: "5:00 AM - 6:00 PM",
      entryFee: "Free",
    },
    {
      id: 5,
      name: "Bhalka Tirth",
      type: "Religious Site",
      distance: "2.5 km",
      rating: 4.4,
      description: "Sacred site associated with Lord Krishna",
      timings: "6:00 AM - 6:00 PM",
      entryFee: "Free",
    },
  ];

  const transportation = [
    {
      id: 1,
      mode: "Flight",
      icon: Plane,
      nearestAirport: "Diu Airport",
      distance: "80 km",
      duration: "1.5 hours",
      alternatives: "Rajkot (150 km), Ahmedabad (350 km)",
      description: "Nearest major airport with good connectivity",
    },
    {
      id: 2,
      mode: "Train",
      icon: Train,
      nearestStation: "Veraval Railway Station",
      distance: "4 km",
      duration: "10 minutes",
      connections: "Connected to major cities",
      description: "Well-connected railway station",
    },
    {
      id: 3,
      mode: "Bus",
      icon: Bus,
      operator: "State Transport / Private",
      duration: "2-8 hours depending on route",
      majorRoutes: "Ahmedabad, Rajkot, Bhavnagar, Junagadh",
      description: "Regular bus services from nearby cities",
    },
    {
      id: 4,
      mode: "Car/Taxi",
      icon: Navigation,
      rentalAvailable: "Yes - Hotels can arrange",
      costEstimate: "₹2,000 - ₹5,000 per day",
      bestFor: "Flexible travel with group",
      description: "Available through hotels and local services",
    },
  ];

  const services = [
    {
      id: 1,
      name: "Prasad Counter",
      type: "Religious Service",
      description: "Sanctified offerings",
      hours: "6:00 AM - 10:00 PM",
      cost: "₹50 - ₹500",
      image: "🙏",
    },
    {
      id: 2,
      name: "Puja Services",
      type: "Religious Service",
      description: "Special pujas and rituals",
      hours: "6:00 AM - 10:00 PM",
      cost: "₹300 - ₹5,000",
      image: "🕯️",
    },
    {
      id: 3,
      name: "Photography",
      type: "Documentation",
      description: "Professional photo/video services",
      hours: "6:00 AM - 6:00 PM",
      cost: "₹500 - ₹2,000",
      image: "📸",
    },
    {
      id: 4,
      name: "Guide Services",
      type: "Tourism",
      description: "Expert temple guides (Multilingual)",
      hours: "6:00 AM - 10:00 PM",
      cost: "₹300 - ₹1,000",
      image: "👨‍🏫",
    },
    {
      id: 5,
      name: "Wheelchair Access",
      type: "Accessibility",
      description: "Wheelchairs and assistance",
      hours: "6:00 AM - 10:00 PM",
      cost: "Free/Rental ₹100",
      image: "♿",
    },
    {
      id: 6,
      name: "Medical Clinic",
      type: "Healthcare",
      description: "First aid and medical assistance",
      hours: "24/7",
      cost: "₹100 - ₹500",
      image: "🏥",
    },
    {
      id: 7,
      name: "Souvenir Shop",
      type: "Shopping",
      description: "Religious items and souvenirs",
      hours: "6:00 AM - 10:00 PM",
      cost: "₹100 - ₹5,000",
      image: "🎁",
    },
    {
      id: 8,
      name: "Lockers & Storage",
      type: "Facility",
      description: "Secure storage for valuables",
      hours: "6:00 AM - 10:00 PM",
      cost: "₹50 - ₹200",
      image: "🔒",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Temple Services & Info
          </h1>
          <p className="text-muted-foreground">
            Complete information about accommodation, food, attractions and
            transport
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
          <TabsTrigger
            value="accommodation"
            className="flex items-center text-xs lg:text-sm"
          >
            <Hotel className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Stay</span>
          </TabsTrigger>
          <TabsTrigger
            value="pooja"
            className="flex items-center text-xs lg:text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Pooja</span>
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="flex items-center text-xs lg:text-sm"
          >
            <Utensils className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Food</span>
          </TabsTrigger>
          <TabsTrigger
            value="attractions"
            className="flex items-center text-xs lg:text-sm"
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Nearby</span>
          </TabsTrigger>
          <TabsTrigger
            value="transport"
            className="flex items-center text-xs lg:text-sm"
          >
            <Navigation className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Travel</span>
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="flex items-center text-xs lg:text-sm"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Services</span>
          </TabsTrigger>
          <TabsTrigger
            value="donation"
            className="flex items-center text-xs lg:text-sm"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="hidden sm:inline ml-1">E-Hundi & Daan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pooja" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poojaSevas.map((seva) => (
              <Card key={seva.id} className="shadow-temple border-primary/10 hover:border-primary/40 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-primary" />
                      {seva.name}
                    </CardTitle>
                    <Badge className="bg-gradient-sacred text-primary-foreground font-mono">
                      {seva.dakshina}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-3 pt-1">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {seva.duration}
                    </span>
                    <span>• {seva.timings}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{seva.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                      Pooja Samagri: {seva.samagri}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSeva(seva);
                        toast({
                          title: "Seva Selected",
                          description: `You have selected ${seva.name}. Report to Seva Booking Counter opposite Nandi Mandapam.`,
                        });
                      }}
                      className="bg-gradient-sacred text-xs"
                    >
                      Book This Seva
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accommodation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodations.map((hotel) => (
              <Card
                key={hotel.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedService(hotel)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{hotel.image}</span>
                    <Badge className="bg-gradient-sacred text-white">
                      {hotel.category}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-foreground mb-1">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(hotel.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-semibold text-foreground">
                      {hotel.rating}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {hotel.price}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {hotel.distance}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-temple">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="food" className="space-y-4">
          <Card className="shadow-sacred border-primary/20 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center text-amber-950">
                  <Utensils className="w-5 h-5 mr-2 text-primary" />
                  Shree Somnath Trust Mahaprasad Bhojanalaya (Annakshetra)
                </CardTitle>
                <Badge className="bg-emerald-600 text-white font-medium">Serving Now</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-amber-900">
                Subsidized pure satvik Gujarati Bhojan Prasad served with devotion in spacious air-cooled dining halls. Clean filtered water and traditional service.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
                  <span className="text-muted-foreground block">Lunch Prasad</span>
                  <span className="font-semibold text-foreground">11:00 AM – 03:00 PM</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
                  <span className="text-muted-foreground block">Dinner Prasad</span>
                  <span className="font-semibold text-foreground">07:00 PM – 10:00 PM</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
                  <span className="text-muted-foreground block">Token Price</span>
                  <span className="font-semibold text-emerald-700">₹50 (Unlimited Thali)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{restaurant.image}</span>
                    <Badge className="bg-orange-500 text-white">
                      {restaurant.category}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-foreground mb-1">
                    {restaurant.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(restaurant.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-semibold text-foreground">
                      {restaurant.rating}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground">
                      <strong>Cuisine:</strong> {restaurant.cuisine}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {restaurant.price}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {restaurant.hours}
                    </div>
                    <div className="text-muted-foreground">
                      <strong>Speciality:</strong> {restaurant.speciality}
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attractions.map((attraction) => (
              <Card
                key={attraction.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground flex-1">
                      {attraction.name}
                    </h3>
                    <Badge variant="outline">{attraction.type}</Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3">
                    {attraction.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                      {attraction.rating}/5
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {attraction.distance} from temple
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {attraction.timings}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Entry: {attraction.entryFee}
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <MapIcon className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          {/* Complimentary Veraval Junction Pilgrim Eco-Shuttle Tracker */}
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <Bus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Free Pilgrim Eco-Shuttle (Veraval Jn ⇄ Shree Somnath Mandir)</span>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complimentary zero-fare electric bus service connecting Veraval Railway Station Platform-1 to Digvijay Dwar
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-600 text-white font-semibold">
                    100% Free Seva
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    Every 15 Mins
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shuttleFleet.map((bus) => (
                  <div key={bus.id} className="p-3 bg-background/90 rounded-lg border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground font-mono">{bus.plateNumber}</span>
                      <Badge variant="outline" className={`text-[10px] ${bus.status === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                        {bus.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-muted-foreground text-[11px]">
                      <div>📍 <strong>Location:</strong> {bus.currentLocation}</div>
                      <div>🎯 <strong>Next:</strong> {bus.destination} (ETA: {bus.etaMinutes}m)</div>
                      <div className="flex items-center justify-between pt-1">
                        <span>🔋 {bus.batteryPct}% EV</span>
                        <span>👥 {bus.occupancy}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Driver: {bus.driverName}</span>
                      <a href={`tel:${bus.contact}`} className="text-primary font-medium hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-muted/60 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">
                    <strong>Route Stops:</strong> Veraval Jn (PF 1 Exit) ➔ Bhadrakali Chowk ➔ Triveni Sangam Ghat ➔ Digvijay Dwar (Gate 2)
                  </span>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[11px]">
                  Operating: 05:00 AM – 11:30 PM
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>No ticket required. Priority boarding pass holders get reserved front seats.</span>
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
                  onClick={() => {
                    setIssuedShuttlePass(null);
                    setShowShuttleModal(true);
                  }}
                >
                  <Bus className="w-3.5 h-3.5 mr-1.5" />
                  Generate Free Shuttle Boarding Pass
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportation.map((transport) => {
              const Icon = transport.icon;
              return (
                <Card
                  key={transport.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Icon className="w-5 h-5 mr-2" />
                      {transport.mode}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {transport.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      {transport.mode === "Flight" && (
                        <>
                          <div>
                            <strong>Nearest Airport:</strong>{" "}
                            {transport.nearestAirport}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {transport.distance}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />~
                            {transport.duration} drive time
                          </div>
                          <div>
                            <strong>Alternatives:</strong>{" "}
                            {transport.alternatives}
                          </div>
                        </>
                      )}

                      {transport.mode === "Train" && (
                        <>
                          <div>
                            <strong>Station:</strong> {transport.nearestStation}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {transport.distance}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />~
                            {transport.duration} by auto
                          </div>
                          <div>
                            <strong>Connections:</strong>{" "}
                            {transport.connections}
                          </div>
                        </>
                      )}

                      {transport.mode === "Bus" && (
                        <>
                          <div>
                            <strong>Operators:</strong> {transport.operator}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            {transport.duration}
                          </div>
                          <div>
                            <strong>Major Routes:</strong>{" "}
                            {transport.majorRoutes}
                          </div>
                        </>
                      )}

                      {transport.mode === "Car/Taxi" && (
                        <>
                          <div>
                            <strong>Rental Available:</strong>{" "}
                            {transport.rentalAvailable}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {transport.costEstimate} per day
                          </div>
                          <div>
                            <strong>Best For:</strong> {transport.bestFor}
                          </div>
                        </>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-temple">
                      <Navigation className="w-4 h-4 mr-2" />
                      Book/Arrange
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow text-center"
              >
                <CardContent className="p-4">
                  <div className="text-5xl mb-3">{service.image}</div>

                  <h3 className="font-bold text-foreground mb-1">
                    {service.name}
                  </h3>

                  <Badge variant="secondary" className="text-xs mb-3">
                    {service.type}
                  </Badge>

                  <p className="text-muted-foreground text-sm mb-3">
                    {service.description}
                  </p>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div>{service.hours}</div>
                    <div className="font-semibold text-foreground">
                      {service.cost}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setLockerToken(null);
                      setSelectedService(service);
                    }}
                    className="w-full bg-gradient-sacred text-white text-xs"
                  >
                    <Info className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donation" className="space-y-6">
          <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-amber-500/5 to-transparent shadow-divine">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-xl flex items-center text-rose-700 dark:text-rose-400">
                    <Heart className="w-5 h-5 mr-2 text-rose-600 fill-rose-600" />
                    Shree Somnath Trust Digital E-Hundi & Seva Daan
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Every sacred contribution directly supports pilgrim annakshetra, gaumata protection, and sanctum heritage. All donations are 80G tax-exempt under IT Act 1961.
                  </p>
                </div>
                <Badge variant="outline" className="border-rose-500/40 text-rose-700 bg-rose-50 dark:bg-rose-950/40 text-xs py-1 self-start sm:self-auto">
                  80G Tax Exemption (50% Deduction)
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {causes.map((cause) => (
              <Card
                key={cause.id}
                className="shadow-temple border-primary/10 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{cause.icon}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      80G Eligible
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-foreground leading-snug">
                    {cause.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {cause.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      Recommended Dakshina Presets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cause.presets.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedCause(cause);
                            setDonationAmount(amt);
                          }}
                          className={`text-xs px-2.5 py-1 rounded border transition-all ${
                            selectedCause?.id === cause.id && donationAmount === amt
                              ? "bg-rose-600 text-white border-rose-600 font-semibold shadow-sm"
                              : "bg-background border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedCause(cause);
                      setDonationAmount(cause.suggested);
                    }}
                    className="w-full bg-gradient-sacred text-xs mt-2"
                  >
                    <Heart className="w-3.5 h-3.5 mr-1.5 fill-white" />
                    Offer Seva (₹{cause.suggested})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Details & Token Modal */}
      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedService(null);
            setLockerToken(null);
            setMobilityToken(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedService?.image}</span>
              <div>
                <DialogTitle>{selectedService?.name}</DialogTitle>
                <DialogDescription>
                  {selectedService?.type} — Shree Somnath Trust
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-3 bg-muted/60 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timings:</span>
                <span className="font-medium text-foreground">
                  {selectedService?.hours}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard Charges:</span>
                <span className="font-semibold text-primary">
                  {selectedService?.cost}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Counter Location:</span>
                <span className="font-medium">Main Gate #1 Facilitation Hall</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedService?.description}. Managed by Shree Somnath Trust staff with verified security and assisted queue clearance.
            </p>

            {selectedService?.name?.includes("Locker") && (
              <div className="border border-primary/20 bg-primary/5 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">
                      Instant Cloakroom Token
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary"
                  >
                    Gate #1 Counter
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Deposit your mobile phone, smart watch, and leather items safely before entering the sanctum.
                </p>

                {lockerToken ? (
                  <div className="p-3 bg-background border rounded text-center space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Your Secure Digital Locker Tag
                    </p>
                    <p className="text-xl font-bold font-mono tracking-widest text-primary">
                      {lockerToken}
                    </p>
                    <p className="text-[10px] text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Present this token at Cloakroom Desk #3
                    </p>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      const num = Math.floor(1000 + Math.random() * 9000);
                      const tag = `SOM-LCK-${num}`;
                      setLockerToken(tag);
                      toast({
                        title: "Locker Token Generated",
                        description: `Assigned locker token: ${tag}`,
                      });
                    }}
                    className="w-full bg-gradient-sacred text-xs"
                  >
                    Generate Free Locker Token
                  </Button>
                )}
              </div>
            )}

            {selectedService?.name?.includes("Wheelchair") && (
              <div className="border border-primary/20 bg-primary/5 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">♿</span>
                    <span className="font-semibold text-sm">
                      Divyangjan & Senior Citizen Mobility Pass
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary"
                  >
                    Ramp Entry Gate #1
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complimentary wheelchair reservation and seva escort through barrier-free ramps to sanctum sabha mandapa.
                </p>

                {mobilityToken ? (
                  <div className="p-3 bg-background border rounded text-center space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Assigned Mobility Priority Pass
                    </p>
                    <p className="text-xl font-bold font-mono tracking-widest text-primary">
                      {mobilityToken}
                    </p>
                    <p className="text-[10px] text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Show at Divyang Facilitation Desk (Gate #1 Ramp)
                    </p>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      const num = Math.floor(1000 + Math.random() * 9000);
                      const tag = `SOM-MOB-${num}`;
                      setMobilityToken(tag);
                      toast({
                        title: "Mobility Pass Issued",
                        description: `Priority pass assigned: ${tag}. Collect wheelchair at Gate #1 Ramp.`,
                      });
                    }}
                    className="w-full bg-gradient-sacred text-xs"
                  >
                    Reserve Complimentary Wheelchair
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sacred Seva & E-Hundi Donation Modal */}
      <Dialog
        open={Boolean(selectedCause)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCause(null);
            setDonationReceipt(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedCause?.icon}</span>
              <div>
                <DialogTitle className="text-lg">{selectedCause?.title}</DialogTitle>
                <DialogDescription>
                  Shree Somnath Trust • {selectedCause?.taxExemption}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {!donationReceipt ? (
            <form onSubmit={handleDonate} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Select or Enter Dakshina Amount (₹)</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCause?.presets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all ${
                        donationAmount === amt
                          ? "bg-rose-600 text-white border-rose-600 font-bold"
                          : "bg-muted text-foreground border-border hover:bg-muted/80"
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-sm font-bold text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    min="101"
                    placeholder="Custom amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="pl-8 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="dnName" className="text-xs">Devotee / Donor Name *</Label>
                  <Input
                    id="dnName"
                    placeholder="Full name as per PAN"
                    value={donorDetails.name}
                    onChange={(e) => setDonorDetails({ ...donorDetails, name: e.target.value })}
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dnPhone" className="text-xs">Mobile Number *</Label>
                  <Input
                    id="dnPhone"
                    placeholder="10-digit mobile"
                    value={donorDetails.phone}
                    onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dnPan" className="text-xs">PAN Card Number</Label>
                    <span className="text-[10px] text-rose-600 font-semibold">For 80G Tax Benefit</span>
                  </div>
                  <Input
                    id="dnPan"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={donorDetails.pan}
                    onChange={(e) => setDonorDetails({ ...donorDetails, pan: e.target.value.toUpperCase() })}
                    className="h-8 text-xs uppercase font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dnEmail" className="text-xs">Email Address (Optional)</Label>
                  <Input
                    id="dnEmail"
                    type="email"
                    placeholder="For e-receipt"
                    value={donorDetails.email}
                    onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/60 rounded-lg text-xs space-y-1 border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Offering To:</span>
                  <span className="font-semibold text-foreground">{selectedCause?.title}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dakshina Offering:</span>
                  <span className="font-bold text-rose-600 text-sm">₹{Number(donationAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px] pt-1 border-t">
                  <span>Trust 80G Certificate:</span>
                  <span className="text-emerald-600 font-medium">Auto-generated upon offering</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCause(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isDonating}
                  className="bg-gradient-sacred text-xs"
                >
                  <Heart className="w-3.5 h-3.5 mr-1 fill-white" />
                  {isDonating ? "Processing Daan..." : `Offer Seva ₹${Number(donationAmount).toLocaleString()}`}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-lg border-2 border-primary/30 bg-card space-y-3">
                <div className="text-center border-b pb-2">
                  <h4 className="font-bold text-base text-foreground tracking-wide">
                    SHREE SOMNATH TRUST
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Prabhas Patan, Gir Somnath, Gujarat • Registered Public Religious Trust
                  </p>
                  <div className="flex justify-center gap-3 text-[10px] text-muted-foreground pt-1">
                    <span>PAN: <strong className="font-mono text-foreground">{donationReceipt.trustPan}</strong></span>
                    <span>80G Reg: <strong className="font-mono text-foreground">{donationReceipt.exemptionCode}</strong></span>
                  </div>
                </div>

                <div className="text-center py-1">
                  <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-mono">
                    Official 80G Tax Exemption Receipt
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receipt No: <strong className="font-mono text-foreground">{donationReceipt.receiptNo}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-muted/40 rounded border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Donor Name</span>
                    <strong className="text-foreground">{donationReceipt.donorName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Donor PAN</span>
                    <strong className="text-foreground font-mono">{donationReceipt.donorPan || "Not Provided"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Seva Cause</span>
                    <strong className="text-foreground">{donationReceipt.causeTitle}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Date & Time</span>
                    <strong className="text-foreground">{new Date(donationReceipt.date).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-800 text-center">
                  <span className="text-xs text-muted-foreground block">Donation Amount</span>
                  <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-400">
                    ₹{donationReceipt.amount.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">
                    Eligible for 50% deduction under Section 80G of the Income Tax Act, 1961
                  </span>
                  <p className="text-[11px] font-serif text-amber-800 dark:text-amber-300 italic pt-1 border-t border-rose-200/50 mt-2">
                    "ॐ नमः शिवाय • शुभं भवतु कल्याणं आरोग्यं धनसम्पदः"
                  </p>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded border border-dashed text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block">Digital Verification Hash</span>
                    <span className="font-mono text-[10px] text-primary select-all">
                      SHA256: {donationReceipt.receiptNo}-VERIFIED-TRUST
                    </span>
                  </div>
                  <div className="border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded px-2 py-1 text-center font-serif text-[10px] font-bold">
                    TRUST SEAL<br /><span className="text-[9px] font-normal">SHREE SOMNATH</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
                  <span>Authorized Signatory: Chief Executive Officer, Shree Somnath Trust</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Digitally Verified
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs"
                >
                  Download / Print 80G Receipt
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setDonationReceipt(null);
                    setSelectedCause(null);
                  }}
                  className="bg-gradient-sacred text-xs"
                >
                  Close & Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Free Pilgrim Shuttle Boarding Pass Modal */}
      <Dialog open={showShuttleModal} onOpenChange={setShowShuttleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Bus className="w-5 h-5 text-emerald-600" />
              <span>Complimentary Veraval Shuttle Boarding Pass</span>
            </DialogTitle>
            <DialogDescription>
              Instant priority boarding e-pass for Shree Somnath Trust electric shuttle buses
            </DialogDescription>
          </DialogHeader>

          {!issuedShuttlePass ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!shuttlePassData.passengerName.trim()) {
                  toast({
                    title: "Name Required",
                    description: "Please enter the lead pilgrim's name.",
                    variant: "destructive",
                  });
                  return;
                }
                const pass = shuttleService.generateShuttlePass(shuttlePassData);
                setIssuedShuttlePass(pass);
                toast({
                  title: "Shuttle Pass Issued",
                  description: `Pass #${pass.passNumber} generated successfully.`,
                });
              }}
              className="space-y-3 pt-1 text-xs"
            >
              <div>
                <label className="block font-medium mb-1 text-foreground">Lead Pilgrim Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={shuttlePassData.passengerName}
                  onChange={(e) =>
                    setShuttlePassData({ ...shuttlePassData, passengerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1 text-foreground">Number of Devotees</label>
                  <select
                    value={shuttlePassData.passengersCount}
                    onChange={(e) =>
                      setShuttlePassData({ ...shuttlePassData, passengersCount: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-2 border rounded-lg bg-background text-foreground text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Devotee{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-foreground">Train / Flight Info</label>
                  <input
                    type="text"
                    placeholder="e.g. Somnath Exp (19218)"
                    value={shuttlePassData.trainNumber}
                    onChange={(e) =>
                      setShuttlePassData({ ...shuttlePassData, trainNumber: e.target.value })
                    }
                    className="w-full px-2.5 py-2 border rounded-lg bg-background text-foreground text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Boarding Pickup Stop</label>
                <select
                  value={shuttlePassData.pickupStop}
                  onChange={(e) =>
                    setShuttlePassData({ ...shuttlePassData, pickupStop: e.target.value })
                  }
                  className="w-full px-2.5 py-2 border rounded-lg bg-background text-foreground text-xs"
                >
                  <option value="Veraval Railway Junction (PF 1 Exit)">Veraval Railway Junction (PF 1 Exit)</option>
                  <option value="Somnath GSRTC Bus Terminal">Somnath GSRTC Bus Terminal</option>
                  <option value="Triveni Sangam Pilgrimage Ghat">Triveni Sangam Pilgrimage Ghat</option>
                </select>
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-200 text-[11px] text-emerald-800 dark:text-emerald-300">
                🌱 <strong>Zero Fare & Zero Emission:</strong> Operated entirely free of charge with clean battery-electric buses by Shree Somnath Trust.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShuttleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Generate E-Pass
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Shree Somnath Trust Transit</span>
                    <span className="font-bold text-sm text-foreground">Free Shuttle E-Pass</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                    {issuedShuttlePass.passNumber}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Devotee Name</span>
                    <strong className="text-foreground">{issuedShuttlePass.passengerName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Devotees</span>
                    <strong className="text-foreground">{issuedShuttlePass.passengersCount} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Pickup Bay</span>
                    <strong className="text-foreground">{issuedShuttlePass.pickupStop}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Destination</span>
                    <strong className="text-foreground">{issuedShuttlePass.dropStop}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Fare</span>
                    <strong className="text-emerald-600 font-bold">₹0 (Free Seva)</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Date</span>
                    <strong className="text-foreground">{issuedShuttlePass.validDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-background/80 rounded border">
                  <QrCode className="w-9 h-9 text-emerald-600 shrink-0" />
                  <div className="text-[10px] text-muted-foreground">
                    Show this pass to the shuttle conductor at <strong>Veraval Platform-1 Shuttle Bay</strong> for priority queue boarding.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs"
                >
                  Print / Save Pass
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowShuttleModal(false);
                    setIssuedShuttlePass(null);
                  }}
                  className="bg-emerald-600 text-white text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesInfo;
