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
  Bus,
  Flame,
  Shirt,
  Ban,
  HelpCircle,
  MessageSquare,
  Gift,
  Truck,
  Volume2,
  VolumeX,
  ShieldAlert,
  Shield,
  FileText,
  Download,
  UserCheck,
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
import { shuttleService } from "@/services/shuttleService";
import { festivalService } from "@/services/festivalService";
import { dressCodeService } from "@/services/dressCodeService";
import { faqService } from "@/services/faqService";
import { prasadService } from "@/services/prasadService";
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
  const [shuttleFleet, setShuttleFleet] = useState(shuttleService.getFleetStatus());
  const [showShuttleAdminModal, setShowShuttleAdminModal] = useState(false);
  const [activeFestival, setActiveFestival] = useState(festivalService.getActiveFestival());
  const [showFestivalModal, setShowFestivalModal] = useState(false);
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
  const [showDressCodeAdminModal, setShowDressCodeAdminModal] = useState(false);
  const [inspectionLogs, setInspectionLogs] = useState([
    { id: 1, gate: "Gate 1 (Main Promenade)", issue: "Leather belt detected", action: "Redirected to Free Locker #1", time: "10:15 AM", guard: "Constable Rathod" },
    { id: 2, gate: "Gate 2 (VIP & Senior)", issue: "Mobile phone in pocket", action: "Deposited in Electronic Locker #24", time: "10:42 AM", guard: "Trust Guard Mahendra" },
    { id: 3, gate: "Gate 1 (Main Promenade)", issue: "Shorts worn (western wear)", action: "Provided traditional Dhoti wrap at Trust Counter", time: "11:05 AM", guard: "Trust Sevak Ramesh" },
  ]);
  const [newLogGate, setNewLogGate] = useState("Gate 1 (Main Promenade)");
  const [newLogIssue, setNewLogIssue] = useState("Leather belt / wallet");
  const [newLogAction, setNewLogAction] = useState("Redirected to Free Cloakroom Counter 1");
  const [showFaqAdminModal, setShowFaqAdminModal] = useState(false);
  const [unresolvedFaqs, setUnresolvedFaqs] = useState(faqService.getUnresolvedQueries());
  const [faqAnswerInput, setFaqAnswerInput] = useState({});
  const [showPrasadAdminModal, setShowPrasadAdminModal] = useState(false);
  const [postalOrders, setPostalOrders] = useState(prasadService.getOrders());
  const [adminSirenActive, setAdminSirenActive] = useState(false);
  const [showEvacuationCommandModal, setShowEvacuationCommandModal] = useState(false);
  const [evacuationLevel, setEvacuationLevel] = useState("Level 2");
  const [cctvZoneFilter, setCctvZoneFilter] = useState("all");
  const [securityIncidents, setSecurityIncidents] = useState([
    {
      id: "SEC-INC-101",
      timestamp: "08:45 AM",
      location: "Gate 1 (Digvijay Dwar)",
      guardId: "SG-RATHOD-42",
      guardName: "Havildar K. Rathod",
      category: "Unattended Baggage",
      severity: "high",
      status: "Resolved",
      notes: "Devotee luggage bag left unattended near shoe counter; screened by scanning squad and safely restored to pilgrim.",
    },
    {
      id: "SEC-INC-102",
      timestamp: "10:12 AM",
      location: "South Sea Promenade",
      guardId: "SG-JADEJA-18",
      guardName: "Coast Guard Sevak Jadeja",
      category: "Perimeter Barricade",
      severity: "medium",
      status: "Resolved",
      notes: "High tide wave warning ignored on rocky shoreline; 2 visitors guided back inside safety perimeter rail.",
    },
    {
      id: "SEC-INC-103",
      timestamp: "11:30 AM",
      location: "Sabha Mandap Queue Line",
      guardId: "SG-PATEL-07",
      guardName: "Marshal P. Patel",
      category: "Crowd Surge",
      severity: "low",
      status: "Under Monitoring",
      notes: "Devotee rush during midday Bhog Aarti; gate 3 bypass opened to balance flow into pradakshina corridor.",
    },
  ]);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentCategoryFilter, setIncidentCategoryFilter] = useState("all");
  const [newIncident, setNewIncident] = useState({
    location: "Gate 1 (Digvijay Dwar)",
    guardId: "SG-RATHOD-42",
    guardName: "Havildar K. Rathod",
    category: "Unattended Baggage",
    severity: "medium",
    notes: "",
  });
  const [securityRoster, setSecurityRoster] = useState([
    {
      id: "GRD-101",
      name: "Havildar K. Rathod",
      rank: "Head Constable (SSF)",
      shift: "Morning",
      post: "Gate 1 (Digvijay Dwar)",
      phone: "+91 98250 11201",
      status: "On Post",
      assignedArea: "Baggage Scanner & Metal Detector 1",
    },
    {
      id: "GRD-102",
      name: "Guard Mahendra Solanki",
      rank: "Security Sevak",
      shift: "Morning",
      post: "Gate 2 (VIP & Senior Ramp)",
      phone: "+91 98250 11202",
      status: "On Post",
      assignedArea: "Divyang Ramp Escort Lane",
    },
    {
      id: "GRD-103",
      name: "Coast Guard Sevak Jadeja",
      rank: "Coastal Marine Warden",
      shift: "Morning",
      post: "South Sea Wall Walkway",
      phone: "+91 98250 11203",
      status: "On Post",
      assignedArea: "Arabian Sea Tidal Barricade",
    },
    {
      id: "GRD-104",
      name: "Marshal P. Patel",
      rank: "Crowd Flow Marshal",
      shift: "Evening",
      post: "Sabha Mandap Queue Line",
      phone: "+91 98250 11204",
      status: "Standby",
      assignedArea: "Pradakshina Bypass & Sanctum Queue",
    },
    {
      id: "GRD-105",
      name: "Officer D. Vala",
      rank: "Sub-Inspector (SSF)",
      shift: "Evening",
      post: "Central CCTV Control Room",
      phone: "+91 98250 11205",
      status: "Standby",
      assignedArea: "AI Telemetry & Video Surveillance Feed",
    },
    {
      id: "GRD-106",
      name: "Guard Vikram Chudasama",
      rank: "Night Watchman",
      shift: "Night",
      post: "Outer Boundary & Sea Wall",
      phone: "+91 98250 11206",
      status: "Off Duty",
      assignedArea: "Perimeter Infrared Sensor Patrolling",
    },
  ]);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [rosterShiftFilter, setRosterShiftFilter] = useState("all");

  const toggleAdminSiren = () => {
    if (adminSirenActive) {
      if (window._divyaSetuAdminSiren) {
        try {
          window._divyaSetuAdminSiren.osc.stop();
          window._divyaSetuAdminSiren.lfo.stop();
          window._divyaSetuAdminSiren.ctx.close();
        } catch {}
        window._divyaSetuAdminSiren = null;
      }
      setAdminSirenActive(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(650, ctx.currentTime);

      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.7, ctx.currentTime);
      lfoGain.gain.setValueAtTime(240, ctx.currentTime);

      lfo.connect(osc.frequency);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      lfo.start();

      window._divyaSetuAdminSiren = { ctx, osc, lfo };
      setAdminSirenActive(true);

      setTimeout(() => {
        if (window._divyaSetuAdminSiren) {
          try {
            window._divyaSetuAdminSiren.osc.stop();
            window._divyaSetuAdminSiren.lfo.stop();
            window._divyaSetuAdminSiren.ctx.close();
          } catch {}
          window._divyaSetuAdminSiren = null;
        }
        setAdminSirenActive(false);
      }, 7000);
    } catch {}
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateIncident = (e) => {
    e?.preventDefault();
    if (!newIncident.notes.trim()) {
      toast({
        title: "Missing Incident Notes",
        description: "Please enter incident description or action taken notes.",
        variant: "destructive",
      });
      return;
    }
    const created = {
      id: `SEC-INC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: newIncident.location,
      guardId: newIncident.guardId || "SG-PATROL-01",
      guardName: newIncident.guardName || "Duty Guard",
      category: newIncident.category,
      severity: newIncident.severity,
      status: "Under Monitoring",
      notes: newIncident.notes.trim(),
    };
    setSecurityIncidents([created, ...securityIncidents]);
    setNewIncident({
      location: "Gate 1 (Digvijay Dwar)",
      guardId: "SG-RATHOD-42",
      guardName: "Havildar K. Rathod",
      category: "Unattended Baggage",
      severity: "medium",
      notes: "",
    });
    toast({
      title: "Security Incident Logged",
      description: `Report ${created.id} recorded in central security log.`,
    });
  };

  const handleReassignPost = (guardId, newPost) => {
    setSecurityRoster((prev) =>
      prev.map((g) => (g.id === guardId ? { ...g, post: newPost, status: "On Post" } : g))
    );
    const guard = securityRoster.find((g) => g.id === guardId);
    toast({
      title: "Guard Post Reassigned",
      description: `${guard?.name || "Guard"} reallocated to ${newPost}`,
    });
  };

  const handleToggleGuardStatus = (guardId) => {
    setSecurityRoster((prev) =>
      prev.map((g) => {
        if (g.id !== guardId) return g;
        const nextStatus =
          g.status === "On Post"
            ? "Break"
            : g.status === "Break"
            ? "Standby"
            : g.status === "Standby"
            ? "Off Duty"
            : "On Post";
        return { ...g, status: nextStatus };
      })
    );
  };

  const exportSecurityReportCSV = () => {
    const headers = [
      "Incident_ID",
      "Timestamp",
      "Location",
      "Category",
      "Severity",
      "Status",
      "Guard_Name",
      "Guard_ID",
      "Action_Notes"
    ];

    const incidentRows = securityIncidents.map((inc) => [
      `"${inc.id}"`,
      `"${inc.timestamp}"`,
      `"${inc.location}"`,
      `"${inc.category}"`,
      `"${inc.severity.toUpperCase()}"`,
      `"${inc.status}"`,
      `"${inc.guardName}"`,
      `"${inc.guardId}"`,
      `"${(inc.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...incidentRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `Somnath_Security_Incident_Ledger_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Security Ledger Exported",
      description: `Downloaded Somnath_Security_Incident_Ledger_${dateStr}.csv (${securityIncidents.length} entries)`,
    });
  };

  const exportInspectionLogsCSV = () => {
    const headers = ["Log_ID", "Time", "Gate", "Issue_Detected", "Action_Taken", "Inspecting_Guard"];
    const rows = inspectionLogs.map((log) => [
      `"${log.id}"`,
      `"${log.time}"`,
      `"${log.gate}"`,
      `"${log.issue}"`,
      `"${log.action}"`,
      `"${log.guard}"`
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `Somnath_Frisking_Inspection_Log_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Frisking Report Exported",
      description: `Downloaded Somnath_Frisking_Inspection_Log_${dateStr}.csv (${inspectionLogs.length} entries)`,
    });
  };

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

          {/* Zone Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-muted/40 p-2.5 rounded-lg border border-border/60">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Zone Filter:</span>
            {[
              { id: "all", label: "All Cameras", count: cameras.length },
              { id: "sanctum", label: "Sanctum & Mandap", count: cameras.filter((c) => c.zone === "sanctum").length },
              { id: "gates", label: "Entrance Gates", count: cameras.filter((c) => c.zone === "gates").length },
              { id: "sea", label: "Sea Wall & Promenade", count: cameras.filter((c) => c.zone === "sea").length },
              { id: "parking", label: "Parking & Transit", count: cameras.filter((c) => c.zone === "parking").length },
            ].map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={cctvZoneFilter === tab.id ? "default" : "outline"}
                className="h-7 text-xs rounded-full px-3"
                onClick={() => setCctvZoneFilter(tab.id)}
              >
                {tab.label}
                <Badge
                  variant={cctvZoneFilter === tab.id ? "secondary" : "outline"}
                  className="ml-1.5 px-1 py-0 text-[10px] h-4"
                >
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cameras
              .filter((cam) => (cctvZoneFilter === "all" ? true : cam.zone === cctvZoneFilter))
              .map((camera) => (
                <Card
                  key={camera.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setPreviewCamera(camera)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{camera.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {camera.zone || "general"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {camera.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                        REC
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Crowd Density
                      </span>
                      <Badge
                        className={`text-xs ${getCrowdLevelColor(camera.crowd_density || 40)}`}
                      >
                        {camera.crowd_density || 40}%
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
                className="w-full justify-start text-emerald-700 dark:text-emerald-400 font-medium"
                onClick={() => setShowShuttleAdminModal(true)}
              >
                <Bus className="mr-2 h-4 w-4 text-emerald-600" />
                🚌 Electric Shuttle Fleet & Driver Dispatch ({shuttleFleet.filter(b => b.status === 'In Transit').length} En Route)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-amber-700 dark:text-amber-400 font-medium"
                onClick={() => setShowFestivalModal(true)}
              >
                <Flame className="mr-2 h-4 w-4 text-amber-600" />
                🔱 Festival Protocol: {activeFestival.badge} (Cap: {activeFestival.capacity.toLocaleString()})
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-indigo-700 dark:text-indigo-400 font-medium"
                onClick={() => setShowDressCodeAdminModal(true)}
              >
                <Shirt className="mr-2 h-4 w-4 text-indigo-600" />
                🥋 Sanctum Dress Code & Frisking Inspection Desk ({inspectionLogs.length} Logged Interventions)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-teal-700 dark:text-teal-400 font-medium"
                onClick={() => {
                  setUnresolvedFaqs(faqService.getUnresolvedQueries());
                  setShowFaqAdminModal(true);
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-teal-600" />
                ❓ Pilgrim Help Desk & Unresolved Queries ({unresolvedFaqs.filter(q => q.status === "pending").length} Pending)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-orange-700 dark:text-orange-400 font-medium"
                onClick={() => {
                  setPostalOrders(prasadService.getOrders());
                  setShowPrasadAdminModal(true);
                }}
              >
                <Gift className="mr-2 h-4 w-4 text-orange-600" />
                📦 Postal Prasad Dispatch Cell ({postalOrders.filter(o => !o.status.includes("Dispatched")).length} Pending Packaging)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-700 dark:text-red-400 font-medium"
                onClick={() => setShowEvacuationCommandModal(true)}
              >
                <ShieldAlert className="mr-2 h-4 w-4 text-red-600" />
                🚨 Crisis Command & Evacuation Protocol (Emergency Mustering)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-blue-700 dark:text-blue-400 font-medium"
                onClick={() => setShowIncidentModal(true)}
              >
                <Shield className="mr-2 h-4 w-4 text-blue-600" />
                🛡️ Security Incident Log & Entry Desk ({securityIncidents.length} Reported Today)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sky-700 dark:text-sky-400 font-medium"
                onClick={() => setShowRosterModal(true)}
              >
                <UserCheck className="mr-2 h-4 w-4 text-sky-600" />
                👮 Security Guard Shift Roster & Post Allocation ({securityRoster.filter((g) => g.status === "On Post").length} On Duty)
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
                <option value="emergency_evacuation">🚨 Emergency Evacuation & PA Siren</option>
              </select>
            </div>

            {/* PA Siren Audio Test Control */}
            <div className="p-3 rounded-lg border bg-destructive/10 border-destructive/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-destructive block">
                    Temple PA Siren Synthesizer Test
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Simulate loudspeaker acoustic alarm before emergency broadcast
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={toggleAdminSiren}
                  className={`text-xs h-7 border-destructive/50 ${
                    adminSirenActive ? "bg-destructive text-white animate-pulse" : "text-destructive hover:bg-destructive/10"
                  }`}
                >
                  {adminSirenActive ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 mr-1" />
                      Stop Siren Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 mr-1" />
                      Test Siren Tone (7s)
                    </>
                  )}
                </Button>
              </div>
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

      {/* Electric Shuttle Fleet & Dispatch Dialog */}
      <Dialog open={showShuttleAdminModal} onOpenChange={setShowShuttleAdminModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-emerald-600" />
                  <span>Electric Shuttle Fleet Control & Live Dispatch</span>
                </DialogTitle>
                <DialogDescription>
                  Veraval Junction ⇄ Shree Somnath Mandir complimentary transit management
                </DialogDescription>
              </div>
              <Badge className="bg-emerald-600 text-white font-mono">
                Fleet: 3 Buses
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-center border">
              <div>
                <div className="text-2xl font-bold text-foreground">1,480</div>
                <div className="text-[11px] text-muted-foreground">Pilgrims Ferried Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 font-mono">100%</div>
                <div className="text-[11px] text-muted-foreground">Electric EV Fleet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary font-mono">15 min</div>
                <div className="text-[11px] text-muted-foreground">Avg Dispatch Interval</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {shuttleFleet.map((bus) => (
                <div key={bus.id} className="p-3 rounded-lg border bg-card space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground font-mono">{bus.plateNumber}</span>
                      <Badge variant="outline" className={`text-[10px] ${bus.status === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                        {bus.status}
                      </Badge>
                    </div>
                    <span className="font-medium text-emerald-600">{bus.batteryPct}% Battery</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-muted-foreground pt-1">
                    <div>
                      <span className="block text-[10px]">Type</span>
                      <strong className="text-foreground">{bus.vehicleType.split(' ')[0]} {bus.vehicleType.split(' ')[1]}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px]">Driver</span>
                      <strong className="text-foreground">{bus.driverName}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px]">Location</span>
                      <strong className="text-foreground">{bus.currentLocation.split('(')[0]}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px]">Occupancy</span>
                      <strong className="text-foreground">{bus.occupancy}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                    <span className="text-muted-foreground">Contact: {bus.contact}</span>
                    {bus.status === 'Scheduled' && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                        onClick={() => {
                          setShuttleFleet((prev) =>
                            prev.map((b) =>
                              b.id === bus.id
                                ? { ...b, status: 'In Transit', currentLocation: 'Departing North Depot for Veraval' }
                                : b
                            )
                          );
                          toast({
                            title: "Bus Dispatched",
                            description: `${bus.plateNumber} dispatched to Veraval Railway Junction.`,
                          });
                        }}
                      >
                        ⚡ Dispatch to Veraval Jn
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Festival Surge Protocol Dialog */}
      <Dialog open={showFestivalModal} onOpenChange={setShowFestivalModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <span>Temple Festival Surge Protocol & Capacity Mode</span>
                </DialogTitle>
                <DialogDescription>
                  Switch operational modes between Normal Day, Maha Shivratri, and Shravan Maas
                </DialogDescription>
              </div>
              <Badge className="bg-amber-600 text-white font-mono">
                {activeFestival.badge}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {Object.values(festivalService.getProfiles()).map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    const updated = festivalService.setFestivalMode(prof.id);
                    setActiveFestival(updated);
                    toast({
                      title: "Protocol Mode Updated",
                      description: `Active mode set to: ${prof.name} (Max Capacity: ${prof.capacity.toLocaleString()}).`,
                    });
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    activeFestival.id === prof.id
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="font-semibold text-xs text-foreground mb-1">{prof.name}</div>
                  <div className="text-[11px] text-muted-foreground">Cap: {prof.capacity.toLocaleString()}</div>
                  <div className="text-[10px] text-primary font-medium mt-1">{prof.sanctumHours}</div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border space-y-2 text-xs">
              <div className="font-semibold text-foreground flex items-center justify-between">
                <span>Active Operating Profile: {activeFestival.name}</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
                  {activeFestival.isContinuousDarshan ? "24/7 Akhand Darshan" : "Standard Timings"}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {activeFestival.bannerText}
              </p>
            </div>

            {activeFestival.prahars && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Maha Shivratri 4 Prahar Abhishek Timeline
                </h4>
                <div className="space-y-2">
                  {activeFestival.prahars.map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border bg-card text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.abhishek}</div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{p.crowd} Influx</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sanctum Dress Code & Gate Frisking Inspection Modal */}
      <Dialog open={showDressCodeAdminModal} onOpenChange={setShowDressCodeAdminModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shirt className="w-5 h-5 text-indigo-600" />
              <span>Sanctum Dress Code & Gate Frisking Security Desk</span>
            </DialogTitle>
            <DialogDescription>
              Security checkpoint compliance management and pilgrim cloakroom redirection tracking across temple gates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <span className="text-[11px] text-muted-foreground block">Gate 1 (Main Promenade)</span>
                <span className="font-bold text-foreground text-sm">4 Frisking Booths</span>
                <span className="text-[10px] text-emerald-600 block mt-1">Free Cloakroom Adjacent</span>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <span className="text-[11px] text-muted-foreground block">Gate 2 (Digvijay Dwar)</span>
                <span className="font-bold text-foreground text-sm">VIP & Senior Ramp</span>
                <span className="text-[10px] text-indigo-600 block mt-1">Wheelchair & Locker Desk</span>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <span className="text-[11px] text-muted-foreground block">Sanctum Sanctity Rules</span>
                <span className="font-bold text-foreground text-sm">100% Traditional Only</span>
                <span className="text-[10px] text-amber-600 block mt-1">No Leather / Mobiles</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-1">
              <span className="font-semibold text-foreground block">
                👮 Security Guard Frisking Standing Order
              </span>
              <p className="text-muted-foreground leading-relaxed">
                If devotees arrive wearing western casuals (denim, shorts, sleeveless) or carry prohibited items (leather belts, cellphones), politely escort them to <strong>Free Cloakroom Counter 1</strong> for mobile token deposit or offer complimentary traditional dhoti cloth before queue entry.
              </p>
            </div>

            {/* Quick Log Form */}
            <div className="p-3 rounded-lg border bg-card space-y-2">
              <span className="font-semibold text-foreground block">
                Log New Gate Redirection / Compliance Intervention
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newLogGate}
                  onChange={(e) => setNewLogGate(e.target.value)}
                  className="h-8 px-2 border rounded bg-background text-xs"
                >
                  <option value="Gate 1 (Main Promenade)">Gate 1 (Main Promenade)</option>
                  <option value="Gate 2 (VIP & Senior)">Gate 2 (VIP & Senior)</option>
                  <option value="Gate 3 (Samudra Path)">Gate 3 (Samudra Path)</option>
                </select>
                <select
                  value={newLogIssue}
                  onChange={(e) => setNewLogIssue(e.target.value)}
                  className="h-8 px-2 border rounded bg-background text-xs"
                >
                  <option value="Leather belt / wallet">Leather belt / wallet</option>
                  <option value="Mobile phone detected">Mobile phone detected</option>
                  <option value="Western shorts / casuals">Western shorts / casuals</option>
                  <option value="Camera / electronic watch">Camera / electronic watch</option>
                  <option value="Tobacco / matchbox">Tobacco / matchbox</option>
                </select>
                <Input
                  value={newLogAction}
                  onChange={(e) => setNewLogAction(e.target.value)}
                  placeholder="Action taken..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    if (!newLogAction.trim()) return;
                    const newEntry = {
                      id: Date.now(),
                      gate: newLogGate,
                      issue: newLogIssue,
                      action: newLogAction,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      guard: adminUser?.full_name || "On-duty Officer",
                    };
                    setInspectionLogs([newEntry, ...inspectionLogs]);
                    toast({
                      title: "Intervention Logged",
                      description: `Logged for ${newLogGate}: ${newLogIssue}`,
                    });
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-7 text-xs"
                >
                  Record Guard Log Entry
                </Button>
              </div>
            </div>

            {/* Interventions History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Today's Frisking & Cloakroom Redirections ({inspectionLogs.length})
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2 border-indigo-500/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10"
                  onClick={exportInspectionLogsCSV}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export Frisking CSV
                </Button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {inspectionLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded border bg-card flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{log.issue}</div>
                      <div className="text-[11px] text-muted-foreground">{log.gate} • Action: {log.action}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px]">{log.time}</Badge>
                      <span className="text-[10px] text-muted-foreground block">{log.guard}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pilgrim Help Desk & Unresolved Inquiries Modal */}
      <Dialog open={showFaqAdminModal} onOpenChange={setShowFaqAdminModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <span>Pilgrim Help Desk & Unresolved Devotee Queries</span>
            </DialogTitle>
            <DialogDescription>
              Review devotee inquiries submitted at the Trust Help Desk and dispatch SMS / WhatsApp resolutions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-teal-500/10 border-teal-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Active Knowledge FAQs</span>
                <strong className="text-base text-teal-700 dark:text-teal-300">{faqService.getFAQs().length} Articles</strong>
              </div>
              <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Pending Inquiries</span>
                <strong className="text-base text-amber-600">
                  {unresolvedFaqs.filter((q) => q.status === "pending").length} Devotees
                </strong>
              </div>
              <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Resolved & SMS Dispatched</span>
                <strong className="text-base text-emerald-600">
                  {unresolvedFaqs.filter((q) => q.status === "resolved").length}
                </strong>
              </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Devotee Inquiry Inbox ({unresolvedFaqs.length})
              </h4>

              {unresolvedFaqs.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground border rounded-lg">
                  No inquiries in queue. All pilgrim questions have been answered.
                </div>
              ) : (
                <div className="space-y-3">
                  {unresolvedFaqs.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className={`p-3.5 rounded-lg border transition-all ${
                        inquiry.status === "pending"
                          ? "border-amber-500/40 bg-amber-500/5 shadow-sm"
                          : "border-border/60 bg-muted/20 opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-semibold text-foreground text-xs">
                            {inquiry.question}
                          </span>
                        </div>
                        <Badge
                          variant={inquiry.status === "pending" ? "default" : "outline"}
                          className={`text-[10px] shrink-0 ${
                            inquiry.status === "pending"
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : "text-emerald-600 border-emerald-500/40"
                          }`}
                        >
                          {inquiry.status === "pending" ? "Needs Response" : "Answered"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-2">
                        <span>📞 Devotee Mobile: <strong>+91-{inquiry.phone}</strong></span>
                        <span>🕒 Logged: {inquiry.timestamp}</span>
                      </div>

                      {inquiry.resolutionNote && (
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300 mb-2">
                          ✓ Officer Response: {inquiry.resolutionNote}
                        </div>
                      )}

                      {inquiry.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-border/50">
                          <Input
                            placeholder="Type officer resolution advice / guidance..."
                            value={faqAnswerInput[inquiry.id] || ""}
                            onChange={(e) =>
                              setFaqAnswerInput({
                                ...faqAnswerInput,
                                [inquiry.id]: e.target.value,
                              })
                            }
                            className="h-8 text-xs flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const note = faqAnswerInput[inquiry.id] || "Assistance provided via Help Desk telephone.";
                              faqService.resolveQuery(inquiry.id, note);
                              setUnresolvedFaqs(faqService.getUnresolvedQueries());
                              toast({
                                title: "Inquiry Resolved",
                                description: `Resolution SMS dispatched to +91-${inquiry.phone}`,
                              });
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs shrink-0"
                          >
                            Resolve & SMS Pilgrim
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFaqAdminModal(false)}
                className="text-xs"
              >
                Close Help Desk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Postal Prasad Dispatch Queue Modal */}
      <Dialog open={showPrasadAdminModal} onOpenChange={setShowPrasadAdminModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
              <Gift className="w-5 h-5 text-orange-600" />
              <span>Shree Somnath Trust Postal Prasad Dispatch Cell</span>
            </DialogTitle>
            <DialogDescription>
              India Post Speed Post consignment manifests, sacred vacuum packing station, and parcel fulfillment queue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-orange-500/10 border-orange-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Active Orders in Queue</span>
                <strong className="text-base text-orange-600 font-bold">{postalOrders.length} Consignments</strong>
              </div>
              <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Awaiting Packing / Sealing</span>
                <strong className="text-base text-amber-600 font-bold">
                  {postalOrders.filter((o) => !o.status.includes("Dispatched")).length} Boxes
                </strong>
              </div>
              <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-center">
                <span className="text-[10px] text-muted-foreground block">Speed Post En Route</span>
                <strong className="text-base text-emerald-600 font-bold">
                  {postalOrders.filter((o) => o.status.includes("Dispatched")).length} Parcels
                </strong>
              </div>
            </div>

            {/* Consignments List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                India Post Manifest & Packaging Pipeline ({postalOrders.length})
              </h4>

              {postalOrders.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground border rounded-lg">
                  No pending postal prasad orders in queue.
                </div>
              ) : (
                <div className="space-y-3">
                  {postalOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className={`p-3.5 rounded-lg border transition-all ${
                        ord.status.includes("Dispatched")
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-orange-500/40 bg-card shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 pb-2 border-b border-border/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-semibold text-foreground">
                              {ord.prasadName}
                            </strong>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              Qty: {ord.quantity}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            Order #{ord.id} • Date: {ord.orderDate} • Amount: ₹{ord.totalAmount}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <Badge
                            className={`text-[10px] font-mono ${
                              ord.status.includes("Dispatched")
                                ? "bg-emerald-600 text-white"
                                : "bg-orange-600 text-white"
                            }`}
                          >
                            {ord.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mb-3">
                        <div className="p-2 bg-muted/40 rounded border border-border/40">
                          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                            Recipient & Address:
                          </span>
                          <strong className="text-foreground">{ord.recipientName}</strong> (📞 +91-{ord.phone})<br />
                          <span className="text-foreground/80">{ord.address}, {ord.city}, {ord.state} - <strong>{ord.pincode}</strong></span>
                        </div>
                        <div className="p-2 bg-muted/40 rounded border border-border/40">
                          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                            Speed Post Consignment:
                          </span>
                          <span className="font-mono font-bold text-primary text-xs block">{ord.consignmentNumber}</span>
                          <span className="text-muted-foreground text-[10px]">
                            Partner: {ord.courierPartner || "India Post Speed Post"} • Est. Delivery: {ord.estDeliveryDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/40">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "India Post Shipping Label Ready",
                              description: `Address slip generated for Consignment ${ord.consignmentNumber}`,
                            });
                            window.print();
                          }}
                          className="text-xs h-7"
                        >
                          Print Shipping Label
                        </Button>
                        {!ord.status.includes("Dispatched") && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const updated = prasadService.updateOrderStatus(
                                ord.id,
                                "Dispatched via India Post Speed Post",
                                "Veraval Head Post Office (RMS)"
                              );
                              setPostalOrders(updated);
                              toast({
                                title: "Consignment Dispatched",
                                description: `Order #${ord.id} handed to India Post Mail Van.`,
                              });
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-7"
                          >
                            <Truck className="w-3.5 h-3.5 mr-1" />
                            Dispatch Speed Post
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPrasadAdminModal(false)}
                className="text-xs"
              >
                Close Dispatch Desk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Temple Crisis Command & Evacuation Protocol Modal */}
      <Dialog open={showEvacuationCommandModal} onOpenChange={setShowEvacuationCommandModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              <span>Temple Crisis Command & Evacuation Protocol</span>
            </DialogTitle>
            <DialogDescription>
              Emergency mustering authorization, automated gate magnetic unlatching, and multi-zone PA loudspeaker broadcast
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            {/* Crisis Level Selector */}
            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 space-y-2">
              <span className="font-semibold text-destructive block uppercase tracking-wider text-[11px]">
                1. Select Emergency Threat Level:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "Level 1", name: "Level 1: Gate Diversion", desc: "Sea gate shut; queues diverted to Gate 1" },
                  { id: "Level 2", name: "Level 2: Queue Evacuation", desc: "Sanctum cleared to North Lawn Assembly A" },
                  { id: "Level 3", name: "Level 3: Full Complex SOS", desc: "Tsunami / Cyclone high-ground mustering" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setEvacuationLevel(lvl.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      evacuationLevel === lvl.id
                        ? "border-destructive bg-destructive text-white shadow-md font-bold"
                        : "border-border bg-card hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="text-xs font-semibold">{lvl.name}</div>
                    <div className={`text-[10px] mt-0.5 ${evacuationLevel === lvl.id ? "text-white/90" : "text-muted-foreground"}`}>
                      {lvl.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gate Override Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. Automated Gate Status Overrides:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2.5 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                  <strong className="block text-foreground">Gate 1 (Main)</strong>
                  <span>OUTFLOW ONLY</span>
                  <Badge className="bg-emerald-600 text-white text-[9px] mt-1 block w-fit">Turnstiles Open</Badge>
                </div>
                <div className="p-2.5 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                  <strong className="block text-foreground">Gate 2 (Digvijay)</strong>
                  <span>108 Ambulance Bay</span>
                  <Badge className="bg-emerald-600 text-white text-[9px] mt-1 block w-fit">Clear Corridor</Badge>
                </div>
                <div className="p-2.5 rounded border bg-destructive/10 border-destructive/30 text-destructive">
                  <strong className="block text-foreground">Emergency Gate 3</strong>
                  <span>Sea Wall Exit</span>
                  <Badge variant="destructive" className="text-[9px] mt-1 block w-fit">Magnetic Unlatch</Badge>
                </div>
                <div className="p-2.5 rounded border bg-destructive/10 border-destructive/30 text-destructive">
                  <strong className="block text-foreground">Emergency Gate 4</strong>
                  <span>East Flank Exit</span>
                  <Badge variant="destructive" className="text-[9px] mt-1 block w-fit">Magnetic Unlatch</Badge>
                </div>
              </div>
            </div>

            {/* Broadcast PA Message Template */}
            <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  3. Automated Tri-Lingual PA Loudspeaker Broadcast (Gujarati, Hindi, English):
                </span>
                <Badge variant="outline" className="text-[10px]">
                  All 12 Zone Loudspeakers
                </Badge>
              </div>
              <p className="p-2.5 rounded bg-background border font-mono text-[11px] text-muted-foreground leading-relaxed">
                "ધ્યાન આપો: કટોકટી પ્રોટોકોલ હેઠળ તમામ દર્શનાર્થીઓ લીલા રંગના ઇમરજન્સી એક્ઝિટ તરફ શાંતિપૂર્વક આગળ વધો. / कृपया ध्यान दें: सुरक्षा प्रोटोकॉल के तहत सभी श्रद्धालु निकटतम आपातकालीन निकास की ओर बढ़ें। / Attention devotees: Please proceed calmly towards green illuminated emergency exits."
              </p>
            </div>

            {/* Command Trigger Buttons */}
            <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-amber-900 dark:text-amber-200">
                ⚠️ Authorizing this command triggers immediate siren synthesizer, SMS alert dispatch to 45 on-duty guards, and push notifications to all pilgrims inside the campus.
              </div>
              <Button
                size="sm"
                onClick={() => {
                  toggleAdminSiren();
                  alertService.reportAlert({
                    title: `EMERGENCY EVACUATION INITIATED (${evacuationLevel})`,
                    type: "safety",
                    severity: "high",
                    description: `Trust Administrator triggered ${evacuationLevel} evacuation. All emergency gates unlatched. Proceed to Assembly Points A & B.`,
                    location: "All Temple Sectors",
                  });
                  toast({
                    title: "🚨 EVACUATION PROTOCOL BROADCAST DISPATCHED",
                    description: `Level: ${evacuationLevel}. Siren and PA broadcast active across all 12 zones.`,
                    variant: "destructive",
                  });
                }}
                className="bg-destructive hover:bg-destructive/90 text-white text-xs shrink-0"
              >
                <ShieldAlert className="w-4 h-4 mr-1.5" />
                Authorize & Broadcast Evacuation
              </Button>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEvacuationCommandModal(false)}
                className="text-xs"
              >
                Close Crisis Command
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Security Incident Log & Entry Modal */}
      <Dialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Security Incident Telemetry & Logging Desk
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log on-ground incidents, unattended baggage, perimeter barricade infractions, and security escorts across Somnath campus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Incidents</span>
                <span className="text-xl font-bold text-foreground">{securityIncidents.length}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-500/20">
                <span className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-semibold block">Active / Monitoring</span>
                <span className="text-xl font-bold text-amber-600">
                  {securityIncidents.filter((i) => i.status === "Under Monitoring").length}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-semibold block">Resolved Today</span>
                <span className="text-xl font-bold text-emerald-600">
                  {securityIncidents.filter((i) => i.status === "Resolved").length}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border bg-red-500/10 border-red-500/20">
                <span className="text-[10px] text-red-700 dark:text-red-300 uppercase font-semibold block">High / Critical</span>
                <span className="text-xl font-bold text-red-600">
                  {securityIncidents.filter((i) => i.severity === "high" || i.severity === "critical").length}
                </span>
              </div>
            </div>

            {/* Incident Entry Form */}
            <form onSubmit={handleCreateIncident} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  New Incident Quick Entry
                </h4>
                <Badge variant="outline" className="text-[10px]">
                  Somnath Security Force (SSF)
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Location / Sector:
                  </label>
                  <select
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  >
                    <option value="Gate 1 (Digvijay Dwar)">Gate 1 (Digvijay Dwar Promenade)</option>
                    <option value="Gate 2 (VIP & Senior Ramp)">Gate 2 (VIP & Senior Ramp)</option>
                    <option value="Sabha Mandap Queue Line">Sabha Mandap Queue Corridor</option>
                    <option value="Sanctum Garbhagriha Corridor">Sanctum Garbhagriha Outflow</option>
                    <option value="South Sea Promenade">South Sea Wall Promenade</option>
                    <option value="East Pilgrim Parking Area">East Pilgrim Parking Area</option>
                    <option value="Prasad Distribution Pavilion">Prasad Distribution Pavilion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Incident Category:
                  </label>
                  <select
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
                    value={newIncident.category}
                    onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                  >
                    <option value="Unattended Baggage">Unattended Baggage</option>
                    <option value="Perimeter Barricade">Perimeter Barricade Infraction</option>
                    <option value="Crowd Surge">Crowd Surge / Queue Bottleneck</option>
                    <option value="Unauthorized Photography">Unauthorized Photography</option>
                    <option value="Lost Child / Person">Lost Child / Missing Pilgrim</option>
                    <option value="Medical Distress">Medical Distress / First Aid</option>
                    <option value="Frisking Non-Compliance">Frisking Non-Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Reporting Guard (Name & ID):
                  </label>
                  <Input
                    className="h-8 text-xs"
                    value={newIncident.guardName}
                    onChange={(e) => setNewIncident({ ...newIncident, guardName: e.target.value })}
                    placeholder="e.g. Havildar K. Rathod"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Severity Level:
                  </label>
                  <div className="flex gap-2">
                    {["low", "medium", "high", "critical"].map((sev) => (
                      <Button
                        key={sev}
                        type="button"
                        size="sm"
                        variant={newIncident.severity === sev ? "default" : "outline"}
                        className={`h-8 flex-1 text-[11px] capitalize ${
                          newIncident.severity === sev && sev === "critical" ? "bg-red-600 hover:bg-red-700 text-white" : ""
                        }`}
                        onClick={() => setNewIncident({ ...newIncident, severity: sev })}
                      >
                        {sev}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Incident Description & Action Taken:
                </label>
                <Input
                  className="h-8 text-xs"
                  placeholder="Detail observations, actions initiated, and security resolution..."
                  value={newIncident.notes}
                  onChange={(e) => setNewIncident({ ...newIncident, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button size="sm" type="submit" className="text-xs h-8">
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  Log Security Incident Entry
                </Button>
              </div>
            </form>

            {/* Log Entries Header & Filter */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Logged Incidents Ledger ({securityIncidents.length})
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 border-blue-500/40 text-blue-700 dark:text-blue-400 hover:bg-blue-500/10"
                    onClick={exportSecurityReportCSV}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export CSV
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["all", "Unattended Baggage", "Perimeter Barricade", "Crowd Surge"].map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={incidentCategoryFilter === cat ? "default" : "outline"}
                      className="h-6 text-[10px] px-2"
                      onClick={() => setIncidentCategoryFilter(cat)}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {securityIncidents
                  .filter((i) => (incidentCategoryFilter === "all" ? true : i.category === incidentCategoryFilter))
                  .map((incident) => (
                    <div
                      key={incident.id}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">{incident.id}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {incident.timestamp}
                          </Badge>
                          <Badge
                            className={`text-[10px] uppercase ${
                              incident.severity === "critical" || incident.severity === "high"
                                ? "bg-red-600 text-white"
                                : incident.severity === "medium"
                                ? "bg-amber-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={incident.status === "Resolved" ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {incident.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] px-2"
                            onClick={() => {
                              const updated = securityIncidents.map((it) =>
                                it.id === incident.id
                                  ? {
                                      ...it,
                                      status: it.status === "Resolved" ? "Under Monitoring" : "Resolved",
                                    }
                                  : it
                              );
                              setSecurityIncidents(updated);
                            }}
                          >
                            Toggle Status
                          </Button>
                        </div>
                      </div>

                      <div className="text-[11px] text-muted-foreground flex flex-wrap gap-3">
                        <span><strong>Location:</strong> {incident.location}</span>
                        <span><strong>Officer:</strong> {incident.guardName} ({incident.guardId})</span>
                        <span><strong>Category:</strong> {incident.category}</span>
                      </div>

                      <p className="text-[11px] text-foreground font-mono bg-muted/40 p-2 rounded">
                        {incident.notes}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowIncidentModal(false)} className="text-xs">
                Close Incident Desk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Guard Shift Assignment Roster Modal */}
      <Dialog open={showRosterModal} onOpenChange={setShowRosterModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-sky-600" />
              Security Guard Shift Assignment Roster & Post Allocation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Somnath Security Force (SSF) on-duty personnel deployment across Morning, Evening, and Night squads.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Shift Squad Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-sky-500/10 border-sky-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-300">Morning Shift</span>
                  <Badge variant="outline" className="text-[10px] bg-background">06:00 - 14:00</Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-sky-700 dark:text-sky-400">
                  {securityRoster.filter((g) => g.shift === "Morning" && g.status === "On Post").length} Active
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Posts: Gate 1, Gate 2, Sea Wall
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Evening Shift</span>
                  <Badge variant="outline" className="text-[10px] bg-background">14:00 - 22:00</Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-amber-700 dark:text-amber-400">
                  {securityRoster.filter((g) => g.shift === "Evening").length} Deployed
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Posts: Sabha Mandap, CCTV Room
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-indigo-500/10 border-indigo-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Night Patrol</span>
                  <Badge variant="outline" className="text-[10px] bg-background">22:00 - 06:00</Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-indigo-700 dark:text-indigo-400">
                  {securityRoster.filter((g) => g.shift === "Night").length} Scheduled
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Posts: Sea Wall & Perimeter Infrared
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                SSF Guard Personnel ({securityRoster.length})
              </span>
              <div className="flex gap-1.5">
                {["all", "Morning", "Evening", "Night"].map((shift) => (
                  <Button
                    key={shift}
                    size="sm"
                    variant={rosterShiftFilter === shift ? "default" : "outline"}
                    className="h-7 text-xs px-2.5"
                    onClick={() => setRosterShiftFilter(shift)}
                  >
                    {shift === "all" ? "All Shifts" : `${shift} Shift`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Guards Roster List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {securityRoster
                .filter((g) => (rosterShiftFilter === "all" ? true : g.shift === rosterShiftFilter))
                .map((guard) => (
                  <div
                    key={guard.id}
                    className="p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{guard.name}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {guard.id}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {guard.rank}
                        </Badge>
                        <Badge
                          className={`text-[10px] ${
                            guard.status === "On Post"
                              ? "bg-emerald-600 text-white"
                              : guard.status === "Break"
                              ? "bg-amber-600 text-white"
                              : guard.status === "Standby"
                              ? "bg-blue-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {guard.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] px-2"
                          onClick={() => handleToggleGuardStatus(guard.id)}
                        >
                          Change Status
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/40">
                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">
                          Assigned Security Post:
                        </label>
                        <select
                          className="w-full h-7 px-2 text-xs rounded border border-input bg-background font-medium"
                          value={guard.post}
                          onChange={(e) => handleReassignPost(guard.id, e.target.value)}
                        >
                          <option value="Gate 1 (Digvijay Dwar)">Gate 1 (Digvijay Dwar Main)</option>
                          <option value="Gate 2 (VIP & Senior Ramp)">Gate 2 (VIP & Divyang Ramp)</option>
                          <option value="South Sea Wall Walkway">South Sea Wall Walkway</option>
                          <option value="Sabha Mandap Queue Line">Sabha Mandap Queue Line</option>
                          <option value="Central CCTV Control Room">Central CCTV Control Room</option>
                          <option value="Outer Boundary & Sea Wall">Outer Boundary & Sea Wall</option>
                          <option value="Prasad Pavilion & Cloakroom">Prasad Pavilion & Cloakroom</option>
                          <option value="Emergency Gate 3 (Sea Gate)">Emergency Gate 3 (Sea Gate)</option>
                        </select>
                      </div>

                      <div>
                        <span className="block text-[10px] font-semibold text-muted-foreground uppercase mb-0.5">
                          Shift & Duty Specifics:
                        </span>
                        <div className="text-muted-foreground flex flex-col gap-0.5">
                          <span>
                            <strong>Shift:</strong> {guard.shift} Squad &bull; <strong>Contact:</strong> {guard.phone}
                          </span>
                          <span className="truncate">
                            <strong>Area:</strong> {guard.assignedArea}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowRosterModal(false)} className="text-xs">
                Close Guard Roster
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
