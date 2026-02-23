import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Camera,
  AlertTriangle,
  BarChart3,
  Bell,
  Users,
  Monitor,
  MapPin,
  CheckCircle,
  Send,
  LogOut,
  Clock,
  QrCode,
  ShieldCheck,
  Star,
  Coins,
  Waves,
  Compass,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cameraService } from "@/services/cameraService";
import { alertService } from "@/services/alertService";
import { authService } from "@/services/authService";
import { bookingService } from "@/services/bookingService";
import { feedbackService } from "@/services/feedbackService";
import { donationService } from "@/services/donationService";
import { weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { useSSE } from "@/hooks/useSSE";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [adminFeedbacks, setAdminFeedbacks] = useState([]);
  const [showFeedbackAdminModal, setShowFeedbackAdminModal] = useState(false);
  const [adminDonations, setAdminDonations] = useState([]);
  const [showDonationAdminModal, setShowDonationAdminModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const coastalWeather = weatherService.getCoastalForecast();
  const [adminUser, setAdminUser] = useState(null);
  const [previewCamera, setPreviewCamera] = useState(null);
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushNotification, setPushNotification] = useState({
    title: "",
    message: "",
    category: "general",
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [accessibilityFilter, setAccessibilityFilter] = useState("all");
  const [accessibilityRequests, setAccessibilityRequests] = useState([
    {
      id: "REQ-901",
      name: "Rameshwar Patel (Age 74)",
      service: "Sanctum Wheelchair",
      gate: "Gate #1 (Main Ramp)",
      status: "Assigned",
      assignedTo: "Sevak Jayesh",
      time: "10:15 AM",
    },
    {
      id: "REQ-902",
      name: "Meenakshi Sundaram (Age 68)",
      service: "Eco-Cart Shuttle",
      gate: "North Parking Pick-up",
      status: "Pending",
      assignedTo: "Unassigned",
      time: "10:22 AM",
    },
    {
      id: "REQ-903",
      name: "Harishankar Joshi (Divyang)",
      service: "Ramp & Mandap Escort",
      gate: "Digvijay Dwar (Gate 2)",
      status: "Dispatched",
      assignedTo: "Trust Escort Bhavesh",
      time: "10:28 AM",
    },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isConnected: isSSELive } = useSSE("/api/v1/stream", {
    enabled: !!adminUser,
    onAlert: (incomingAlert) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "🚨 LIVE EMERGENCY ALERT",
        description: `${incomingAlert.title || "New Alert"} at ${incomingAlert.location || "Temple Zone"}`,
        variant: "destructive",
      });
    },
    onCrowdUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
  });

  useEffect(() => {
    const storedAdmin = authService.getCurrentUser();
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    setAdminUser(storedAdmin);
  }, [navigate]);

  useEffect(() => {
    feedbackService.getFeedbacks().then(setAdminFeedbacks).catch(() => {});
    donationService.getRecentDonations().then(setAdminDonations).catch(() => {});
  }, []);

  const { data: cameras = [], isLoading: camerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: cameraService.getCameras,
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertService.getAlerts,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (alertId) =>
      alertService.acknowledgeAlert(alertId, adminUser?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Alert Acknowledged",
        description: "Alert has been acknowledged and logged",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    },
  });

  const [scanQrInput, setScanQrInput] = useState("");
  const [checkInResult, setCheckInResult] = useState(null);

  const checkInMutation = useMutation({
    mutationFn: (qrId) => bookingService.checkIn(qrId),
    onSuccess: (data) => {
      setCheckInResult({
        success: true,
        reference: scanQrInput.trim() || "DS-GATE-SCAN",
        data: data.booking || {
          devoteeName: "Sanjay Pandya",
          devoteesCount: 2,
          slotTime: "10:00 AM - 11:00 AM",
          gate: "Gate 2 (Digvijay Dwar)",
        },
        time: new Date().toLocaleTimeString(),
      });
      setScanQrInput("");
      toast({
        title: "Pass Verified",
        description: "Devotee entry authorized through Gate 2",
      });
    },
    onError: (err) => {
      setCheckInResult({
        success: false,
        error: err.response?.data?.message || err.message || "Invalid ticket QR or pass already used",
        time: new Date().toLocaleTimeString(),
      });
      toast({
        title: "Entry Denied",
        description: "Invalid pass or already scanned",
        variant: "destructive",
      });
    },
  });

  const handleScanSubmit = (e) => {
    e?.preventDefault();
    if (!scanQrInput.trim()) return;
    checkInMutation.mutate(scanQrInput.trim());
  };

  const handleAcknowledgeAlert = (alertId) => {
    acknowledgeMutation.mutate(alertId);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/admin/login");
  };

  const loading = camerasLoading || alertsLoading;

  const getCrowdLevelColor = (density) => {
    if (density >= 80) return "bg-destructive text-destructive-foreground";
    if (density >= 60) return "bg-orange-500 text-white";
    if (density >= 40) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">
              Divya Setu - Admin Portal
            </h1>
            <Badge variant="outline" className="flex items-center space-x-1.5 px-2.5 py-1">
              <span className={`inline-block h-2 w-2 rounded-full ${isSSELive ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-xs">{isSSELive ? "SSE Stream Connected" : "Telemetry Active"}</span>
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {adminUser?.full_name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Live CCTV & Crowd Monitoring
            </h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/crowd-monitor")}
              >
                <Monitor className="mr-2 h-4 w-4" />
                Crowd Monitor
              </Button>

              <Button variant="outline" onClick={() => navigate("/map")}>
                <MapPin className="mr-2 h-4 w-4" />
                Interactive Map
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cameras.map((camera) => (
              <Card
                key={camera.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setPreviewCamera(camera)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{camera.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {camera.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Crowd Density
                    </span>
                    <Badge
                      className={`text-xs ${getCrowdLevelColor(camera.crowd_density)}`}
                    >
                      {camera.crowd_density}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alert & Emergency Management
            </h2>
            <Button variant="outline" onClick={() => navigate("/emergency")}>
              View All Alerts
            </Button>
          </div>

          <div className="grid gap-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No active alerts</p>
                </CardContent>
              </Card>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <Alert key={alert.id} className="relative">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleTimeString()}
                        </span>
                        {alert.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                    <AlertDescription className="mb-2">
                      {alert.description}
                    </AlertDescription>
                    <div className="text-xs text-muted-foreground">
                      Location: {alert.location}
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </section>

        <section>
          <Card className="shadow-sacred border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <QrCode className="mr-2 h-5 w-5 text-primary" />
                    Gate Ticket Scanner & Devotee Entry
                  </CardTitle>
                  <CardDescription>
                    Scan digital QR darshan pass or enter ticket reference for entry validation
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Active Terminal: Gate 2
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Scan QR code or enter Reference ID (e.g. DS-2026-PASS)"
                  value={scanQrInput}
                  onChange={(e) => setScanQrInput(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  type="submit"
                  disabled={checkInMutation.isPending}
                  className="bg-gradient-sacred shrink-0"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {checkInMutation.isPending ? "Validating Pass..." : "Verify & Check In"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const sample = `DS-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
                    setScanQrInput(sample);
                    checkInMutation.mutate(sample);
                  }}
                  className="shrink-0"
                >
                  Quick Scan Demo
                </Button>
              </form>

              {checkInResult && (
                <div
                  className={`p-4 rounded-lg border text-sm transition-all ${
                    checkInResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-destructive/10 border-destructive/20 text-destructive"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold flex items-center">
                      <CheckCircle
                        className={`mr-2 h-4 w-4 ${
                          checkInResult.success ? "text-emerald-600" : "text-destructive"
                        }`}
                      />
                      {checkInResult.success ? "ENTRY GRANTED: PASS VALIDATED" : "ENTRY REJECTED"}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {checkInResult.time}
                    </span>
                  </div>
                  {checkInResult.success ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground block">Devotee</span>
                        <span className="font-medium">{checkInResult.data?.devoteeName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Devotees</span>
                        <span className="font-medium">{checkInResult.data?.devoteesCount} person(s)</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Slot</span>
                        <span className="font-medium">{checkInResult.data?.slotTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Gate</span>
                        <span className="font-medium">{checkInResult.data?.gate}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs">{checkInResult.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics & Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics Dashboard
              </Button>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Next Aarti: Sandhya Aarti (07:00 PM) • Sanctum Deepa Offering
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Pilgrim & Resource Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start text-emerald-700 dark:text-emerald-400 font-medium"
                onClick={() => setShowAccessibilityModal(true)}
              >
                <Users className="mr-2 h-4 w-4 text-emerald-600" />
                ♿ Divyangjan & Wheelchair Queue ({accessibilityRequests.filter((r) => r.status === "Pending").length} Pending)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-amber-700 dark:text-amber-400 font-medium"
                onClick={() => setShowFeedbackAdminModal(true)}
              >
                <Star className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
                Devotee Feedback & Seva Audit ({adminFeedbacks.length} Reviews)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-orange-700 dark:text-orange-400 font-medium"
                onClick={() => setShowDonationAdminModal(true)}
              >
                <Coins className="mr-2 h-4 w-4 text-orange-500" />
                🪙 E-Hundi & Seva Offerings ({adminDonations.length} Today)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sky-700 dark:text-sky-400 font-medium"
                onClick={() => setShowWeatherModal(true)}
              >
                <Waves className="mr-2 h-4 w-4 text-sky-500" />
                🌊 Coastal Weather & Tide Telemetry ({coastalWeather.tide.status.split(' ')[0]} Tide)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPushModal(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Push Notification / PA Broadcast
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/queue")}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Virtual Queue
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/crowd-monitor")}
              >
                <Users className="mr-2 h-4 w-4" />
                Open Crowd Monitor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {previewCamera && (
        <Dialog open={!!previewCamera} onOpenChange={() => setPreviewCamera(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-primary" />
                <span>{previewCamera.name}</span>
              </DialogTitle>
              <DialogDescription>
                {previewCamera.location} • Real-time AI Vision Analytics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
                <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE FEED</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono">
                  FPS: 30 • 1080p
                </div>
                <div className="text-center text-slate-400">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Active Video Stream</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-muted rounded-lg">
                  <span className="text-xs text-muted-foreground block">Crowd Density</span>
                  <span className="font-bold text-foreground">{previewCamera.crowd_density}%</span>
                </div>
                <div className="p-2.5 bg-muted rounded-lg">
                  <span className="text-xs text-muted-foreground block">Flow Rate</span>
                  <span className="font-bold text-foreground">Normal</span>
                </div>
                <div className="p-2.5 bg-muted rounded-lg">
                  <span className="text-xs text-muted-foreground block">Status</span>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Push Notification & PA Broadcast Modal */}
      <Dialog open={showPushModal} onOpenChange={setShowPushModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Devotee Push Notification & PA Broadcast
            </DialogTitle>
            <DialogDescription>
              Dispatches an immediate alert to all pilgrim web app sessions and temple public address systems.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!pushNotification.title || !pushNotification.message) {
                toast({
                  title: "Input required",
                  description: "Please enter announcement title and message content",
                  variant: "destructive",
                });
                return;
              }

              setIsBroadcasting(true);
              try {
                await alertService.reportAlert({
                  type: "announcement",
                  severity: "medium",
                  title: pushNotification.title,
                  description: pushNotification.message,
                  location: "All Zones (Temple Broadcast)",
                  zoneId: "broadcast",
                });

                toast({
                  title: "Broadcast Dispatched",
                  description: `Announcement "${pushNotification.title}" sent to active devotees.`,
                });
                setShowPushModal(false);
                setPushNotification({ title: "", message: "", category: "general" });
              } catch {
                toast({
                  title: "Dispatch Failed",
                  description: "Unable to broadcast notification. Check network connection.",
                  variant: "destructive",
                });
              } finally {
                setIsBroadcasting(false);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium">Broadcast Category</label>
              <select
                value={pushNotification.category}
                onChange={(e) => setPushNotification({ ...pushNotification, category: e.target.value })}
                className="w-full h-9 px-3 py-1.5 border rounded-md bg-background text-sm"
              >
                <option value="general">General Temple Announcement</option>
                <option value="aarti">Aarti Commencing Alert</option>
                <option value="crowd_diversion">Crowd Diversion / Gate Advisory</option>
                <option value="lost_child">Lost Person / Child Found</option>
                <option value="weather">Coastal Weather / High Tide Advisory</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Notification Title *</label>
              <Input
                placeholder="e.g. Mangla Aarti Darshan Lines Now Open"
                value={pushNotification.title}
                onChange={(e) => setPushNotification({ ...pushNotification, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Message Body *</label>
              <textarea
                placeholder="Enter detailed announcement message..."
                value={pushNotification.message}
                onChange={(e) => setPushNotification({ ...pushNotification, message: e.target.value })}
                rows={3}
                className="w-full p-2.5 border rounded-md bg-background text-sm"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPushModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isBroadcasting}
                className="bg-gradient-sacred"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                {isBroadcasting ? "Broadcasting..." : "Dispatch Broadcast"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Accessibility & Divyang Queue Manager Modal */}
      <Dialog open={showAccessibilityModal} onOpenChange={setShowAccessibilityModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xl">♿</span>
                  <span>Divyangjan & Assisted Darshan Dispatch</span>
                </DialogTitle>
                <DialogDescription>
                  Real-time queue of mobility assistance, ramp escorts, and eco-cart pickups
                </DialogDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {accessibilityRequests.length} active requests
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              {["all", "Pending", "Assigned", "Dispatched"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setAccessibilityFilter(filter)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    accessibilityFilter === filter
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {accessibilityRequests
                .filter(
                  (r) =>
                    accessibilityFilter === "all" ||
                    r.status.toLowerCase() === accessibilityFilter.toLowerCase()
                )
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-lg border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{req.name}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {req.service}
                        </Badge>
                        <Badge
                          variant={
                            req.status === "Pending"
                              ? "destructive"
                              : req.status === "Assigned"
                              ? "default"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                        <span>📍 {req.gate}</span>
                        <span>🕒 Requested: {req.time}</span>
                        <span>🤝 Staff: {req.assignedTo}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "Pending" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-gradient-sacred"
                          onClick={() => {
                            setAccessibilityRequests((prev) =>
                              prev.map((item) =>
                                item.id === req.id
                                  ? { ...item, status: "Assigned", assignedTo: "Sevak Assigned" }
                                  : item
                              )
                            );
                            toast({
                              title: "Volunteer Assigned",
                              description: `Assigned volunteer escort to ${req.name}`,
                            });
                          }}
                        >
                          Assign Volunteer
                        </Button>
                      )}
                      {req.status === "Assigned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-emerald-600 text-emerald-700"
                          onClick={() => {
                            setAccessibilityRequests((prev) =>
                              prev.map((item) =>
                                item.id === req.id
                                  ? { ...item, status: "Dispatched", assignedTo: "Enroute to Gate" }
                                  : item
                              )
                            );
                            toast({
                              title: "Dispatched",
                              description: `Mobility cart/wheelchair dispatched to ${req.gate}`,
                            });
                          }}
                        >
                          Dispatch Cart
                        </Button>
                      )}
                      {req.status === "Dispatched" && (
                        <span className="text-xs text-emerald-600 font-medium">
                          ✓ En Route
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Devotee Feedback & Seva Audit Dialog */}
      <Dialog open={showFeedbackAdminModal} onOpenChange={setShowFeedbackAdminModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Devotee Feedback & Seva Quality Audit</span>
                </DialogTitle>
                <DialogDescription>
                  Verified pilgrim ratings and testimonials on queue management, cleanliness, and darshan
                </DialogDescription>
              </div>
              <Badge className="bg-amber-600 text-white font-mono">
                {adminFeedbacks.length} Reviews
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-center border">
              <div>
                <div className="text-2xl font-bold text-foreground">4.9 / 5</div>
                <div className="text-[11px] text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">96.8%</div>
                <div className="text-[11px] text-muted-foreground">Positive Sentiment</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-[11px] text-muted-foreground">Unresolved Grievances</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {adminFeedbacks.map((fb) => (
                <div key={fb.id} className="p-3 rounded-lg border bg-card space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{fb.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {fb.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(fb.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{fb.comment}"
                  </p>
                  {fb.aspects && (
                    <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground pt-1">
                      <span>Queue: {fb.aspects.queue}★</span>
                      <span>Cleanliness: {fb.aspects.cleanliness}★</span>
                      <span>Prasad: {fb.aspects.prasad}★</span>
                      <span>Security: {fb.aspects.security}★</span>
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground/60 text-right">
                    {new Date(fb.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* E-Hundi & Seva Collections Dialog */}
      <Dialog open={showDonationAdminModal} onOpenChange={setShowDonationAdminModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-orange-500" />
                  <span>Digital E-Hundi & Annakshetra Seva Telemetry</span>
                </DialogTitle>
                <DialogDescription>
                  Real-time devotional daan receipts, 80G tax certificates, and sanctum hundi collections
                </DialogDescription>
              </div>
              <Badge className="bg-orange-600 text-white font-mono">
                Trust PAN: AAATS0984E
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-center border">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{adminDonations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-muted-foreground">Total Daan Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 font-mono">100%</div>
                <div className="text-[11px] text-muted-foreground">80G Tax Certificates Issued</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary font-mono">{adminDonations.length}</div>
                <div className="text-[11px] text-muted-foreground">Devotee Contributions</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Contributions & Seva E-Receipts
              </h4>
              <div className="space-y-2.5">
                {adminDonations.map((d, idx) => (
                  <div key={d.receiptNo || idx} className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{d.donorName}</span>
                        <Badge variant="outline" className="text-[10px] bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300">
                          {d.causeTitle || "General Daan"}
                        </Badge>
                      </div>
                      <span className="font-bold text-emerald-600 text-sm">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                      <span className="font-mono">{d.receiptNo}</span>
                      <span>{new Date(d.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coastal Weather & Maritime Tide Telemetry Dialog */}
      <Dialog open={showWeatherModal} onOpenChange={setShowWeatherModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-sky-500" />
                  <span>Arabian Sea Coastal Telemetry & Maritime Tide Control</span>
                </DialogTitle>
                <DialogDescription>
                  Prabhas Patan shoreline tide cycles, wave height telemetry, and sea safety flags
                </DialogDescription>
              </div>
              <Badge className="bg-sky-600 text-white font-mono">
                {coastalWeather.coordinates}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-center border">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {coastalWeather.tide.heightMeters}m
                </div>
                <div className="text-[11px] text-muted-foreground">Current Tide Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sky-600 font-mono">
                  {coastalWeather.windSpeedKmh} km/h
                </div>
                <div className="text-[11px] text-muted-foreground">Wind ({coastalWeather.windDirection})</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary font-mono">
                  {coastalWeather.waterSafetyFlag.split(' ')[0]}
                </div>
                <div className="text-[11px] text-muted-foreground">Maritime Safety Flag</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border bg-sky-50/50 dark:bg-sky-950/20 text-xs space-y-2">
              <div className="font-semibold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Baan Stambh (Arrow Pillar) & Sea Promenade Protocol</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {coastalWeather.tide.advisory}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-sky-200/50 dark:border-sky-800/50">
                <span>Next High Tide: <strong>{coastalWeather.tide.nextHighTide}</strong></span>
                <span>Next Low Tide: <strong>{coastalWeather.tide.nextLowTide}</strong></span>
                <span>Sunset Darshan: <strong>{coastalWeather.sunsetTime}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Emergency Coastal Marine Contacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {weatherService.getMarineSafetyHotlines().map((hl, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border bg-card text-xs space-y-1">
                    <div className="font-semibold text-foreground">{hl.title}</div>
                    <div className="font-mono text-primary font-bold text-[11px]">{hl.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
