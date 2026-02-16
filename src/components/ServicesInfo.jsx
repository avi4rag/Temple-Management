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

const ServicesInfo = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("accommodation");
  const [selectedSeva, setSelectedSeva] = useState(null);

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
      </Tabs>
    </div>
  );
};

export default ServicesInfo;
