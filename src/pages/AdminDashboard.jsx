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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cameraService } from "@/services/cameraService";
import { alertService } from "@/services/alertService";
import { authService } from "@/services/authService";
import { bookingService } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { useSSE } from "@/hooks/useSSE";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [adminUser, setAdminUser] = useState(null);
  const [previewCamera, setPreviewCamera] = useState(null);
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushNotification, setPushNotification] = useState({
    title: "",
    message: "",
    category: "general",
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
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
    </div>
  );
};

export default AdminDashboard;
