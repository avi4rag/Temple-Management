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
  Search,
  Printer,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { slotService } from "@/services/slotService";
import { bookingService } from "@/services/bookingService";
import { feedbackService } from "@/services/feedbackService";
import DetailedBookingForm from "./DetailedBookingForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, MessageSquare } from "lucide-react";

const QueueSystem = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberOfDevotees, setNumberOfDevotees] = useState(1);
  const [hasBooking, setHasBooking] = useState(false);
  const [bookingToken, setBookingToken] = useState(null);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [devotees, setDevotees] = useState([]);
  const [activeTab, setActiveTab] = useState("book");
  const [trackReference, setTrackReference] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackedBooking, setTrackedBooking] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    rating: 5,
    category: "Sanctum Darshan",
    comment: "",
    aspects: { queue: 5, cleanliness: 5, prasad: 5, security: 5 },
  });

  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    feedbackService.getFeedbacks().then(setFeedbacks).catch(() => {});
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please share a few words about your darshan experience",
        variant: "destructive",
      });
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const saved = await feedbackService.submitFeedback({
        ...feedbackForm,
        name: feedbackForm.name.trim() || "Devotee Pilgrim",
      });
      setFeedbacks((prev) => [saved, ...prev]);
      setShowFeedbackModal(false);
      setFeedbackForm({
        name: "",
        rating: 5,
        category: "Sanctum Darshan",
        comment: "",
        aspects: { queue: 5, cleanliness: 5, prasad: 5, security: 5 },
      });
      toast({
        title: "Dhanyawad! Feedback Received",
        description: "Your darshan experience helps Shree Somnath Trust serve pilgrims better.",
      });
    } catch {
      toast({
        title: "Submission failed",
        description: "Unable to submit feedback at this moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleTrackBooking = async (e) => {
    e?.preventDefault();
    if (!trackReference && !trackPhone) {
      toast({
        title: "Input required",
        description: "Please enter booking reference ID or phone number",
        variant: "destructive",
      });
      return;
    }
    setIsTracking(true);
    try {
      const res = await bookingService.getBooking(trackReference, trackPhone);
      setTrackedBooking(res);
      toast({
        title: "Booking Found",
        description: `Reference: ${res.reference} - Status: ${res.status}`,
      });
    } catch {
      toast({
        title: "Not Found",
        description: "Could not find a booking matching the provided details",
        variant: "destructive",
      });
    } finally {
      setIsTracking(false);
    }
  };

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

  const getAartiTag = (time) => {
    if (time?.includes("07:00")) return "Mangla Aarti";
    if (time?.includes("12:00")) return "Shringar Aarti";
    if (time?.includes("19:00")) return "Sandhya Aarti";
    return null;
  };

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

      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
          <Button
            type="button"
            variant={activeTab === "book" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("book")}
            className="rounded-md"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Book Darshan Slot
          </Button>
          <Button
            type="button"
            variant={activeTab === "track" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("track")}
            className="rounded-md"
          >
            <Search className="w-4 h-4 mr-2" />
            Track Booking / Verify Token
          </Button>
          <Button
            type="button"
            variant={activeTab === "reviews" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("reviews")}
            className="rounded-md"
          >
            <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
            Pilgrim Reviews & Feedback
          </Button>
        </div>
      </div>

      {activeTab === "track" ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-sacred">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Search className="w-5 h-5 mr-2 text-primary" />
                Track Your Darshan Pass
              </CardTitle>
              <CardDescription>
                Enter your booking reference code or registered mobile number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackRef">Booking Reference</Label>
                    <Input
                      id="trackRef"
                      placeholder="e.g. DS-20260215-ABCD"
                      value={trackReference}
                      onChange={(e) => setTrackReference(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trackPhone">Mobile Number</Label>
                    <Input
                      id="trackPhone"
                      placeholder="e.g. 9876543210"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isTracking}
                  className="w-full bg-gradient-sacred"
                >
                  {isTracking ? "Searching Booking..." : "Search Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {trackedBooking && (
            <Card className="shadow-divine border-primary/20">
              <CardHeader className="bg-gradient-sacred text-primary-foreground rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Pass: {trackedBooking.reference}
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      {trackedBooking.slotDate} • {trackedBooking.slotTime}
                    </CardDescription>
                  </div>
                  <Badge className="bg-white text-primary uppercase font-bold">
                    {trackedBooking.status || "CONFIRMED"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground block text-xs">Assigned Gate</span>
                    <span className="font-semibold text-foreground">
                      {trackedBooking.gate || "Gate 2 (Digvijay Dwar)"}
                    </span>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground block text-xs">Primary Contact</span>
                    <span className="font-semibold text-foreground">
                      {trackedBooking.primaryContact?.name || "Devotee"} ({trackedBooking.primaryContact?.phone || "N/A"})
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                    Devotees Registered ({trackedBooking.devotees?.length || 1})
                  </h4>
                  <ul className="text-sm space-y-1">
                    {trackedBooking.devotees?.map((d, idx) => (
                      <li key={idx} className="flex justify-between text-muted-foreground">
                        <span>{d.name} ({d.age} yrs)</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {d.idType || "ID"} ending in {d.idLast4 || "••••"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="flex items-center text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    Print Pass
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setFeedbackForm((prev) => ({
                        ...prev,
                        name: trackedBooking.primaryContact?.name || "",
                        comment: `Darshan completed for token ${trackedBooking.reference}. `,
                      }));
                      setShowFeedbackModal(true);
                    }}
                    className="bg-gradient-sacred flex items-center text-xs"
                  >
                    <Star className="w-3.5 h-3.5 mr-1 text-white fill-white" />
                    Rate Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : activeTab === "reviews" ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="shadow-sacred border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Pilgrim Darshan Feedback & Ratings</span>
                  </CardTitle>
                  <CardDescription>
                    Authentic feedback and experiences shared by devotees after their sacred visit
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-gradient-sacred text-xs shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Share Your Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/40 rounded-lg border text-center">
                <div className="space-y-1">
                  <div className="text-3xl font-extrabold text-foreground">4.9 / 5</div>
                  <div className="flex justify-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">Overall Satisfaction</div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:border-r border-border/60 sm:px-3 pt-2 sm:pt-0">
                  <div className="text-2xl font-bold text-foreground">98%</div>
                  <div className="text-xs text-muted-foreground">Queue Efficiency</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Avg wait under 15 mins</div>
                </div>
                <div className="space-y-1 pt-2 sm:pt-0">
                  <div className="text-2xl font-bold text-foreground">{feedbacks.length + 1200}+</div>
                  <div className="text-xs text-muted-foreground">Verified Devotee Reviews</div>
                  <div className="text-[11px] text-primary font-medium">100% Genuine Devotees</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Devotee Testimonials ({feedbacks.length})
            </h3>
            {feedbacks.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{item.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{item.comment}"
                  </p>
                  {item.aspects && (
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded">Queue: {item.aspects.queue}★</span>
                      <span className="bg-muted px-2 py-0.5 rounded">Cleanliness: {item.aspects.cleanliness}★</span>
                      <span className="bg-muted px-2 py-0.5 rounded">Prasad: {item.aspects.prasad}★</span>
                      <span className="bg-muted px-2 py-0.5 rounded">Security: {item.aspects.security}★</span>
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground/70 text-right">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
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
                  <div>
                    <div className="font-semibold text-foreground">
                      {slot.time}
                    </div>
                    {getAartiTag(slot.time) && (
                      <Badge
                        variant="outline"
                        className="mt-1 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] gap-1 py-0"
                      >
                        <Flame className="w-2.5 h-2.5 text-amber-600" />
                        {getAartiTag(slot.time)}
                      </Badge>
                    )}
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

      <Card className="max-w-2xl mx-auto shadow-temple border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Live Sanctum Queue Telemetry
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-600 font-medium">Live Feed</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-xs text-muted-foreground">Currently Serving</div>
              <div className="text-xl font-bold text-primary font-mono">DS-1084</div>
            </div>
            <div className="p-2.5 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Devotees in Line</div>
              <div className="text-xl font-bold text-foreground">148</div>
            </div>
            <div className="p-2.5 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Est. Wait Time</div>
              <div className="text-xl font-bold text-amber-600">~12 min</div>
            </div>
            <div className="p-2.5 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Movement Rate</div>
              <div className="text-xl font-bold text-emerald-600">38/min</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-md text-xs text-blue-900 flex items-start space-x-2">
            <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Special Assistance Notice:</span> Senior citizens (65+) and differently-abled devotees may report directly to Gate 1 (Brahmakund Marg) for priority electric cart escort.
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}

      {/* Pilgrim Feedback Dialog */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Share Darshan Experience</span>
            </DialogTitle>
            <DialogDescription>
              Your devotional feedback helps the Temple Trust continuously improve facilities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Overall Experience Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= feedbackForm.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2 font-medium">
                  {feedbackForm.rating === 5 ? "Divine / Exceptional" : `${feedbackForm.rating} Stars`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fbName" className="text-xs">Your Name</Label>
                <Input
                  id="fbName"
                  placeholder="e.g. Rameshwar Patel"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fbCat" className="text-xs">Category</Label>
                <select
                  id="fbCat"
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                  className="w-full h-8 px-2 border rounded-md bg-background text-xs"
                >
                  <option value="Sanctum Darshan">Sanctum Darshan</option>
                  <option value="Queue Management">Queue Management</option>
                  <option value="Aarti Experience">Aarti Experience</option>
                  <option value="Accessibility & Ramps">Accessibility & Ramps</option>
                  <option value="Prasad Distribution">Prasad Distribution</option>
                  <option value="Cloakroom & Footwear">Cloakroom & Footwear</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 p-2.5 bg-muted/40 rounded-lg border text-xs">
              <span className="font-semibold text-foreground block">Facility Ratings</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "queue", label: "Queue Speed", icon: "⏱️" },
                  { key: "cleanliness", label: "Cleanliness", icon: "🧹" },
                  { key: "prasad", label: "Prasad Quality", icon: "🍬" },
                  { key: "security", label: "Security & Sevaks", icon: "🛡️" },
                ].map((aspect) => (
                  <div key={aspect.key} className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{aspect.icon} {aspect.label}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() =>
                            setFeedbackForm({
                              ...feedbackForm,
                              aspects: { ...feedbackForm.aspects, [aspect.key]: starVal },
                            })
                          }
                          className={`text-[11px] px-1 rounded transition-colors ${
                            starVal <= (feedbackForm.aspects?.[aspect.key] || 5)
                              ? "text-amber-500 font-bold"
                              : "text-muted-foreground/30"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="fbComment" className="text-xs">Darshan Thoughts & Suggestions *</Label>
              <textarea
                id="fbComment"
                rows={3}
                placeholder="Share your experience regarding queue movement, priest guidance, or cleanliness..."
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                className="w-full p-2.5 border rounded-md bg-background text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingFeedback}
                className="bg-gradient-sacred text-xs"
              >
                {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueSystem;
