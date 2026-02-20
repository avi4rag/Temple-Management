import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  ArrowLeft,
  ArrowRight,
  QrCode,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { devoteeSchema } from "@/schemas/booking";
import { slotService } from "@/services/slotService";
import { useLanguage } from "@/contexts/LanguageContext";

const DetailedBookingForm = ({ selectedSlot, onBack }) => {
  const { t, currentLanguage } = useLanguage();
  const [step, setStep] = useState(1);
  const [quotaType, setQuotaType] = useState("standard");
  const [assistanceType, setAssistanceType] = useState("wheelchair");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [devoteeCount, setDevoteeCount] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const { toast } = useToast();

  const validatePhoneAndCount = () => {
    const newErrors = {};

    if (!phoneNumber.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    const count = parseInt(devoteeCount);
    if (!count || count < 1 || count > 6) {
      newErrors.count = "Number of devotees must be between 1 and 6";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validatePhoneAndCount()) {
        const count = parseInt(devoteeCount);
        const initialDevotees = Array.from({ length: count }, (_, index) => ({
          name: "",
          age: "",
          idType: "aadhaar",
          idLast4: "",
          phone: index === 0 ? phoneNumber : "",
        }));
        setDevotees(initialDevotees);
        setStep(2);
      }
    }
  };

  const validateDevotees = () => {
    const newErrors = {};

    devotees.forEach((devotee, index) => {
      try {
        devoteeSchema.parse({
          name: devotee.name,
          age: parseInt(devotee.age),
          idType: devotee.idType || "aadhaar",
          idLast4: devotee.idLast4,
          phone: devotee.phone,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            newErrors[`${index}-${err.path[0]}`] = err.message;
          });
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateDevotee = (index, field, value) => {
    setDevotees((prev) =>
      prev.map((devotee, i) =>
        i === index ? { ...devotee, [field]: value } : devotee,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!validateDevotees()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await slotService.bookSlot({
        slot: selectedSlot,
        phoneNumber,
        quotaType,
        devotees,
      });

      const reference = result.bookingReference;
      setBookingReference(reference);
      setBookingConfirmed(true);

      toast({
        title: "Booking Confirmed!",
        description: `Your darshan booking has been confirmed. Reference: ${reference}`,
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quotaLabels = {
    standard: "General Darshan",
    senior_divyang: "Divyang / Senior Citizen",
    aarti_priority: "Aarti Priority Darshan",
  };

  const assistanceLabels = {
    wheelchair: "Sanctum Wheelchair (Gate #1 Assistance Desk)",
    battery_cart: "Eco-Cart Shuttle (Parking to Temple Ramp)",
    ramp_escort: "Trust Volunteer Escort (Sabha Mandapa)",
  };

  const handleDownloadTickets = () => {
    toast({
      title: "Generating Digital Pass",
      description: "Opening print/save dialog for your darshan passes...",
    });
    window.print();
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 print:p-0 print:m-0">
        <Card className="border-green-200 bg-green-50/50 print:border-none print:shadow-none print:bg-white">
          <CardHeader className="text-center print:pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center print:hidden">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800 print:text-xl print:text-black">
              Shree Somnath Jyotirlinga Darshan Pass
            </CardTitle>
            <CardDescription className="text-green-700 print:text-sm print:text-gray-600">
              Official Digital Entry Pass — Shree Somnath Trust
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center print:grid-cols-3">
              <div className="p-3 bg-white/80 rounded-lg border print:border-gray-300">
                <p className="text-sm text-muted-foreground">
                  Booking Reference
                </p>
                <p className="text-lg font-bold font-mono tracking-wider">{bookingReference}</p>
              </div>
              <div className="p-3 bg-white/80 rounded-lg border print:border-gray-300">
                <p className="text-sm text-muted-foreground">Darshan Time Slot</p>
                <p className="text-lg font-bold">{selectedSlot}</p>
              </div>
              <div className="p-3 bg-white/80 rounded-lg border print:border-gray-300">
                <p className="text-sm text-muted-foreground">Quota Category</p>
                <p className="text-base font-bold text-primary">
                  {quotaLabels[quotaType] || "General Darshan"}
                </p>
              </div>
            </div>

            {quotaType === "senior_divyang" && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold flex items-center gap-1.5">
                  ♿ Priority Assistance Service:
                </span>
                <span>{assistanceLabels[assistanceType] || "Wheelchair Access at Gate #1"}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold print:text-base">Devotee Entry Passes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                {devotees.map((devotee, index) => (
                  <Card key={index} className="border-2 print:border-gray-400 print:break-inside-avoid">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-base">{devotee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Age: {devotee.age} | {devotee.idType ? devotee.idType.toUpperCase() : 'ID'}: ••••{devotee.idLast4}
                          </p>
                        </div>
                        <Badge variant="secondary">Devotee #{index + 1}</Badge>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg text-center print:bg-white print:border">
                        <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-700 print:text-black" />
                        <p className="text-xs font-mono font-bold tracking-wider">
                          {generateQRCode(index)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
              <Button onClick={handleDownloadTickets} className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Download / Print Tickets
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setBookingConfirmed(false);
                  setStep(1);
                  setPhoneNumber("");
                  setDevoteeCount("");
                  setDevotees([]);
                  setBookingReference("");
                  if (onBack) onBack();
                }}
              >
                Book Another Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Select Slot</span>
            <span>Enter Details</span>
            <span>Confirm</span>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Booking Details
            </CardTitle>
            <CardDescription>
              Selected Time Slot:{" "}
              <Badge variant="secondary">{selectedSlot}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Darshan Quota Selection */}
            <div className="space-y-2">
              <Label>Darshan Quota Category</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setQuotaType("standard")}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    quotaType === "standard"
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className="font-semibold text-sm">General Darshan</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Standard virtual queue entry
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaType("senior_divyang")}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    quotaType === "senior_divyang"
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className="font-semibold text-sm">Divyang & Seniors</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Assisted access & wheelchair lane
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaType("aarti_priority")}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    quotaType === "aarti_priority"
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className="font-semibold text-sm">Aarti & Pooja</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Designated sanctum viewing bay
                  </p>
                </button>
              </div>
            </div>

            {quotaType === "senior_divyang" && (
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3 animate-in fade-in">
                <Label className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Accessibility & Assisted Mobility Services (Complimentary)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssistanceType("wheelchair")}
                    className={`p-2.5 rounded border text-left text-xs transition-all ${
                      assistanceType === "wheelchair"
                        ? "border-primary bg-primary/10 font-medium ring-1 ring-primary"
                        : "border-border bg-background"
                    }`}
                  >
                    ♿ Sanctum Wheelchair
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Stationed at Gate #1
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceType("battery_cart")}
                    className={`p-2.5 rounded border text-left text-xs transition-all ${
                      assistanceType === "battery_cart"
                        ? "border-primary bg-primary/10 font-medium ring-1 ring-primary"
                        : "border-border bg-background"
                    }`}
                  >
                    🛺 Eco-Cart Shuttle
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Parking to Temple entrance
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceType("ramp_escort")}
                    className={`p-2.5 rounded border text-left text-xs transition-all ${
                      assistanceType === "ramp_escort"
                        ? "border-primary bg-primary/10 font-medium ring-1 ring-primary"
                        : "border-border bg-background"
                    }`}
                  >
                    🤝 Volunteer Escort
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Dedicated Trust Sevak escort
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Devotees (Max 6 per Token)</Label>
                <Input
                  id="count"
                  type="number"
                  placeholder="Enter devotees (1-6)"
                  value={devoteeCount}
                  onChange={(e) => setDevoteeCount(e.target.value)}
                  min="1"
                  max="6"
                  className={errors.count ? "border-red-500" : ""}
                />
                {errors.count && (
                  <p className="text-sm text-red-500">{errors.count}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Slots
              </Button>
              <Button onClick={handleNext}>
                Next: Enter Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Devotee Information</CardTitle>
            <CardDescription>
              Please enter details for all {devotees.length} devotees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {devotees.map((devotee, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                      Devotee {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Full Name *</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={devotee.name}
                          onChange={(e) =>
                            updateDevotee(index, "name", e.target.value)
                          }
                          className={
                            errors[`${index}-name`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`${index}-name`] && (
                          <p className="text-sm text-red-500">
                            {errors[`${index}-name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`age-${index}`}>Age *</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          placeholder="Enter age"
                          value={devotee.age}
                          onChange={(e) =>
                            updateDevotee(index, "age", e.target.value)
                          }
                          min="1"
                          max="120"
                          className={
                            errors[`${index}-age`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`${index}-age`] && (
                          <p className="text-sm text-red-500">
                            {errors[`${index}-age`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`idType-${index}`}>Government ID Type *</Label>
                        <select
                          id={`idType-${index}`}
                          value={devotee.idType || "aadhaar"}
                          onChange={(e) =>
                            updateDevotee(index, "idType", e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="aadhaar">Aadhaar Card</option>
                          <option value="pan">PAN Card</option>
                          <option value="voter_id">Voter ID</option>
                          <option value="passport">Passport</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`idLast4-${index}`}>
                          Last 4 Digits of ID *{" "}
                          <span className="text-xs text-muted-foreground font-normal">
                            (Privacy Protected)
                          </span>
                        </Label>
                        <Input
                          id={`idLast4-${index}`}
                          placeholder="e.g. 5678"
                          maxLength={4}
                          value={devotee.idLast4 || ""}
                          onChange={(e) =>
                            updateDevotee(
                              index,
                              "idLast4",
                              e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase(),
                            )
                          }
                          className={`font-mono tracking-widest uppercase ${
                            errors[`${index}-idLast4`] ? "border-red-500" : ""
                          }`}
                        />
                        {errors[`${index}-idLast4`] && (
                          <p className="text-sm text-red-500">
                            {errors[`${index}-idLast4`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          placeholder="Enter 10-digit phone number"
                          value={devotee.phone}
                          onChange={(e) =>
                            updateDevotee(
                              index,
                              "phone",
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          className={
                            errors[`${index}-phone`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`${index}-phone`] && (
                          <p className="text-sm text-red-500">
                            {errors[`${index}-phone`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertDescription>
                All fields marked with * are required. Please ensure all
                information is accurate as it will be verified at the temple
                entrance.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? "Processing..." : "Book Darshan Slot"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedBookingForm;
