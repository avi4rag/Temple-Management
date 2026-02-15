import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Users,
  MapPin,
  QrCode,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  User,
  CreditCard,
  Bell,
  Ticket,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { slotService } from "@/services/slotService";
import DetailedBookingForm from "./DetailedBookingForm";

const QueueSystem = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberOfDevotees, setNumberOfDevotees] = useState(1);
  const [hasBooking, setHasBooking] = useState(false);
  const [bookingToken, setBookingToken] = useState(null);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [devotees, setDevotees] = useState([]);

  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: timeSlots = [] } = useQuery({
    queryKey: ["slots"],
    queryFn: slotService.getSlots,
  });

  useEffect(() => {
    if (numberOfDevotees > 0) {
      const newDevotees = Array.from(
        { length: numberOfDevotees },
        (_, index) => ({
          name: "",
          age: "",
          idType: "Aadhaar",
          idLast4: "",
          phoneNumber: index === 0 ? phoneNumber : "",
        }),
      );
      setDevotees(newDevotees);
    }
  }, [numberOfDevotees, phoneNumber]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-success text-success-foreground";
      case "filling":
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "full":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast({
        title: "Select a time slot",
        description: "Please choose a slot to continue",
        variant: "destructive",
      });
      return;
    }

    setShowDetailedForm(true);
  };

  if (showDetailedForm) {
    return (
      <DetailedBookingForm
        selectedSlot={selectedSlot}
        onBack={() => setShowDetailedForm(false)}
      />
    );
  }

  if (hasBooking) {
    return (
      <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-divine border-success/20">
            <CardHeader className="text-center bg-gradient-sacred text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center justify-center space-x-2 text-xl">
                <CheckCircle2 className="w-6 h-6" />
                <span>Darshan Confirmed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-sacred rounded-full mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Token: {bookingToken || "DS1008"}
                </h2>
                <p className="text-muted-foreground">
                  Show this token at the entry gate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Time Slot</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedSlot}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Devotees</div>
                  <div className="text-sm text-muted-foreground">
                    {devotees.length} person(s)
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Important Instructions:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Arrive 10 minutes before your slot time</li>
                  <li>• Carry a valid photo ID</li>
                  <li>• Follow temple dress code guidelines</li>
                  <li>• Keep mobile phones on silent mode</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-sacred">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setHasBooking(false)}
                >
                  Book Another Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("queue.title")}
        </h1>
        <p className="text-muted-foreground">
          Book your darshan slot and skip the physical queue
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-sacred">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="w-5 h-5 mr-2" />
            {t("queue.bookSlot")} – Select a slot below to continue
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-temple">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Today's Available Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSlot === slot.time
                    ? "border-primary bg-primary/5"
                    : slot.status === "full"
                      ? "border-muted bg-muted/20 cursor-not-allowed opacity-60"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                onClick={() =>
                  slot.status !== "full" && setSelectedSlot(slot.time)
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-foreground">
                    {slot.time}
                  </div>
                  <Badge className={getStatusColor(slot.status)}>
                    {slot.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Wait: {slot.waitTime}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {slot.remaining} slots left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        <Button
          onClick={handleBooking}
          disabled={!selectedSlot || isBooking}
          className="w-full bg-gradient-sacred shadow-sacred py-6 text-lg"
        >
          {isBooking ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Confirming Booking...
            </div>
          ) : (
            <div className="flex items-center">
              <Ticket className="w-5 h-5 mr-2" />
              Confirm Darshan Booking
            </div>
          )}
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto shadow-temple">
        <CardHeader>
          <CardTitle>Live Queue Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">184</div>
              <div className="text-sm text-muted-foreground">In Queue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">15 min</div>
              <div className="text-sm text-muted-foreground">Avg Wait</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-sm text-muted-foreground">On Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueSystem;
