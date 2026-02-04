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

const devoteeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be valid"),
  aadhaar: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

const DetailedBookingForm = ({ selectedSlot, onBack }) => {
  const [step, setStep] = useState(1);
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
    if (!count || count < 1 || count > 20) {
      newErrors.count = "Number of devotees must be between 1 and 20";
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
          aadhaar: "",
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
          aadhaar: devotee.aadhaar,
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const reference = `SNT${Date.now()}`;
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

  const generateQRCode = (devoteeIndex) => {
    return `QR-${bookingReference}-${devoteeIndex + 1}`;
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Booking Confirmed!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your darshan booking has been successfully processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Booking Reference
                </p>
                <p className="text-lg font-bold">{bookingReference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Slot</p>
                <p className="text-lg font-bold">{selectedSlot}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Digital Darshan Tickets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devotees.map((devotee, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">{devotee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Age: {devotee.age}
                          </p>
                        </div>
                        <Badge variant="secondary">Ticket #{index + 1}</Badge>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-600" />
                        <p className="text-xs font-mono">
                          {generateQRCode(index)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Download Tickets
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
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
                <Label htmlFor="count">Number of Devotees</Label>
                <Input
                  id="count"
                  type="number"
                  placeholder="Enter number of devotees (1-20)"
                  value={devoteeCount}
                  onChange={(e) => setDevoteeCount(e.target.value)}
                  min="1"
                  max="20"
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
                        <Label htmlFor={`aadhaar-${index}`}>
                          Aadhaar Number *
                        </Label>
                        <Input
                          id={`aadhaar-${index}`}
                          placeholder="Enter 12-digit Aadhaar number"
                          value={devotee.aadhaar}
                          onChange={(e) =>
                            updateDevotee(
                              index,
                              "aadhaar",
                              e.target.value.replace(/\D/g, "").slice(0, 12),
                            )
                          }
                          className={
                            errors[`${index}-aadhaar`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`${index}-aadhaar`] && (
                          <p className="text-sm text-red-500">
                            {errors[`${index}-aadhaar`]}
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
