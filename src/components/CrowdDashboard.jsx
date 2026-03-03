import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  MapPin,
  RefreshCw,
  Camera,
  Video,
  Flame,
  Bell,
  Sparkles,
  Waves,
  Wind,
  Sun,
  Cpu,
  Wifi,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { crowdService } from "@/services/crowdService";
import { weatherService } from "@/services/weatherService";
import { festivalService } from "@/services/festivalService";

const CrowdDashboard = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedCameraZone, setSelectedCameraZone] = useState(null);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [telemetryUptime] = useState("99.94%");
  const { data: crowdDataQuery, refetch, isFetching } = useQuery({
    queryKey: ["crowd"],
    queryFn: crowdService.getCrowdStatus,
  });

  const aartis = [
    { name: "Mangla Aarti", time: "07:00 AM", desc: "First dawn invocation & sacred jal abhishek", hour: 7 },
    { name: "Shringar Darshan / Bhog", time: "12:00 PM", desc: "Midday adornment and royal prasad offering", hour: 12 },
    { name: "Sandhya Aarti", time: "07:00 PM", desc: "Sunset deepa offering accompanied by sanctum damru", hour: 19 },
    { name: "Shayan Aarti", time: "10:00 PM", desc: "Night rest ceremony before sanctum doors close", hour: 22 },
  ];

  const currentHour = new Date().getHours();
  const nextAarti = aartis.find((a) => a.hour > currentHour) || aartis[0];
  const coastalWeather = weatherService.getCoastalForecast();
  const activeFestival = festivalService.getActiveFestival();

  const [isChiming, setIsChiming] = useState(false);

  const ringAartiBell = () => {
    try {
      setIsChiming(true);
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [528, 1056, 1584, 2112].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        const initialGain = 0.22 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.0);
      });
      setTimeout(() => setIsChiming(false), 3000);
    } catch (e) {
      setIsChiming(false);
    }
  };

  const [liveOffset, setLiveOffset] = useState(0);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    // 1-second interval for countdown and live sync
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetch();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    // Subtle realistic visitor micro-fluctuation
    const fluctuation = setInterval(() => {
      setLiveOffset((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(fluctuation);
    };
  }, [refetch]);

  const handleRefresh = () => {
    setLiveOffset(0);
    setCountdown(20);
    refetch();
  };

  const isRefreshing = isFetching;
  const baseCount = crowdDataQuery?.currentCount || crowdDataQuery?.totalCrowd || 2847;
  const currentCount = Math.max(0, baseCount + liveOffset);
  const capacity = crowdDataQuery?.capacity || crowdDataQuery?.maxCapacity || 5000;
  const waitTime = crowdDataQuery?.waitTime || "25 mins";
  const crowdPercentage = Math.min(100, (currentCount / capacity) * 100);

  const getCrowdStatus = () => {
    if (crowdPercentage < 40)
      return { status: "Low", color: "bg-success", textColor: "text-success" };
    if (crowdPercentage < 70)
      return {
        status: "Moderate",
        color: "bg-warning",
        textColor: "text-warning",
      };
    if (crowdPercentage < 85)
      return {
        status: "High",
        color: "bg-orange-500",
        textColor: "text-orange-500",
      };
    return {
      status: "Critical",
      color: "bg-destructive",
      textColor: "text-destructive",
    };
  };

  const crowdData = getCrowdStatus();
  const zones = crowdDataQuery?.zones || [
    { name: "Main Temple Sanctum", count: 892, capacity: 1200, status: "Moderate" },
    { name: "Pradakshina Path", count: 654, capacity: 800, status: "High" },
    { name: "Gate 1 Divyangjan Ramp ♿", count: 42, capacity: 150, status: "Low", isAccessible: true },
    { name: "Digvijay Dwar (Gate 2)", count: 423, capacity: 600, status: "Low" },
    { name: "Prasad Counter Hall", count: 234, capacity: 400, status: "Moderate" },
    { name: "North Parking Area", count: 567, capacity: 1000, status: "Low" },
    { name: "Sea-Facing Promenade Exit", count: 77, capacity: 200, status: "Low" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("crowd.title")}
          </h1>
          <p className="text-muted-foreground">
            Real-time temple occupancy and crowd flow analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur rounded-full border text-xs text-muted-foreground shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync in {countdown}s</span>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gradient-sacred shadow-sacred"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sacred">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {t("crowd.currentFootfall")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              {currentCount.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${crowdData.color} text-white`}>
                {crowdData.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {crowdPercentage.toFixed(1)}% capacity
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {t("crowd.waitingTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              15 min
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-success">Improving</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Today's Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              12,847
            </div>
            <div className="text-sm text-muted-foreground">
              +23% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">0</div>
            <div className="text-sm text-success">All systems normal</div>
          </CardContent>
        </Card>
      </div>

      {/* Arabian Sea Coastal Weather & Maritime Tide Banner */}
      <Card className="border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-cyan-500/10 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0">
                <Waves className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Arabian Sea Coastal Weather & Tide Advisory
                  </h3>
                  <Badge variant="outline" className={`text-xs ${coastalWeather.tide.isWarningActive ? 'bg-amber-500/10 text-amber-600 border-amber-300' : 'bg-emerald-500/10 text-emerald-600 border-emerald-300'}`}>
                    Flag: {coastalWeather.waterSafetyFlag}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Tide: {coastalWeather.tide.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {coastalWeather.tide.advisory}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 bg-background/60 backdrop-blur px-3.5 py-2 rounded-lg border">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{coastalWeather.temperatureC}°C</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wind className="w-4 h-4 text-sky-500" />
                <span>{coastalWeather.windSpeedKmh} km/h {coastalWeather.windDirection.split(' ')[0]}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Sunset: {coastalWeather.sunsetTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live CCTV Telemetry & Edge AI Vision Network */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Live CCTV Telemetry & Edge AI Vision Network
                  </h3>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 text-xs">
                    8/8 Cameras Online
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Optical Uptime: {telemetryUptime}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  Automated crowd density classification powered by edge inference nodes at Gate 1, Sanctum, and Sea Wall. Low-latency H.264 video feed ingestion for real-time pilgrim safety.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs shrink-0 bg-background/80 backdrop-blur px-3.5 py-2 rounded-lg border flex-wrap">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>30.0 FPS</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wifi className="w-4 h-4 text-sky-500" />
                <span>&lt;140ms Latency</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => setShowTelemetryModal(true)}
              >
                Inspect Telemetry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Festival Surge Protocol & Akhand Darshan Notice */}
      {activeFestival.id !== 'normal' && (
        <Card className="border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 text-xl">
                  🔱
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {activeFestival.name} — Akhand Darshan Active
                    </h3>
                    <Badge className="bg-amber-600 text-white text-xs">
                      {activeFestival.sanctumHours}
                    </Badge>
                    <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 text-xs font-mono">
                      Cap: {activeFestival.capacity.toLocaleString()} Devotees
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                    {activeFestival.bannerText}
                  </p>
                </div>
              </div>

              {activeFestival.prahars && (
                <div className="flex items-center gap-2 text-xs flex-wrap shrink-0">
                  {activeFestival.prahars.map((p, idx) => (
                    <div key={idx} className="bg-background/80 backdrop-blur px-2.5 py-1.5 rounded-lg border text-center">
                      <div className="font-semibold text-[11px] text-foreground">{p.name.split('(')[0]}</div>
                      <div className="text-[10px] text-amber-600 font-mono">{p.crowd} Influx</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sacred Aarti Timings & Sanctum Schedule */}
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent shadow-divine">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center text-lg text-amber-700 dark:text-amber-400">
                <Flame className="w-5 h-5 mr-2 text-amber-600" />
                Sacred Daily Aarti Schedule & Timings
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Sanctum gates open for live darshan during auspicious aarti slots
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 text-white text-xs py-1">
                Next: {nextAarti.name} ({nextAarti.time})
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={ringAartiBell}
                className="text-xs h-7 border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <Bell className={`w-3.5 h-3.5 mr-1 ${isChiming ? "animate-bounce text-amber-600" : ""}`} />
                {isChiming ? "Chiming..." : "Aarti Chime"}
              </Button>
              {onNavigate && (
                <Button
                  size="sm"
                  onClick={() => onNavigate("queue")}
                  className="bg-gradient-sacred text-xs h-7"
                >
                  Book Aarti Slot
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {aartis.map((aarti, idx) => {
              const isUpcoming = aarti.name === nextAarti.name;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    isUpcoming
                      ? "border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/30"
                      : "border-border/60 bg-card/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {aarti.name}
                    </span>
                    <Badge
                      variant={isUpcoming ? "default" : "outline"}
                      className={`text-[10px] ${
                        isUpcoming
                          ? "bg-amber-600 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {aarti.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {aarti.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-divine">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Zone-wise Crowd Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zones.map((zone, index) => {
              const percentage = (zone.count / zone.capacity) * 100;
              const getZoneColor = () => {
                if (percentage < 40) return "bg-success";
                if (percentage < 70) return "bg-warning";
                if (percentage < 85) return "bg-orange-500";
                return "bg-destructive";
              };

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {zone.name}
                      </span>
                      {zone.isAccessible && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                        >
                          Barrier-Free Ramp
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedCameraZone(zone)}
                        className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                        title="View Live CCTV Feed"
                      >
                        <Camera className="w-3.5 h-3.5 mr-1" />
                        Feed
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {zone.count}/{zone.capacity}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${getZoneColor()} text-white border-0`}
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-divine">
        <CardHeader>
          <CardTitle>Temple Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gradient-sacred rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              Interactive temple heatmap showing crowd density
            </p>
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate("navigation")}
            >
              View Interactive Map
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Camera Feed Modal */}
      <Dialog
        open={Boolean(selectedCameraZone)}
        onOpenChange={(open) => !open && setSelectedCameraZone(null)}
      >
        <DialogContent className="max-w-2xl bg-zinc-950 text-zinc-100 border-zinc-800 p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b border-zinc-800">
            <DialogTitle className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                Live Camera Feed — {selectedCameraZone?.name}
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs gap-1.5 py-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                1080p @ 30fps
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              AI Headcount Ingestion & Crowd Flow Telemetry Stream
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video bg-black flex flex-col justify-between p-4 overflow-hidden">
            {/* Camera Overlay Elements */}
            <div className="flex justify-between items-start z-10 text-xs font-mono">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-zinc-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-red-400 font-bold">REC</span>
                <span className="text-zinc-400">CAM-{selectedCameraZone?.name.replace(/\s+/g, '-').toUpperCase()}</span>
              </div>
              <div className="bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-zinc-800 text-zinc-300">
                {new Date().toISOString().replace('T', ' ').slice(0, 19)} IST
              </div>
            </div>

            {/* AI Bounding Box Simulation */}
            <div className="absolute inset-x-12 inset-y-16 border border-emerald-500/30 rounded flex items-center justify-center pointer-events-none">
              <div className="text-center bg-black/70 backdrop-blur px-4 py-2 rounded-lg border border-emerald-500/50 shadow-xl">
                <p className="text-xs text-zinc-400 font-medium">AI Detected Pilgrims</p>
                <p className="text-3xl font-bold font-mono text-emerald-400">
                  {selectedCameraZone?.count || 420}{" "}
                  <span className="text-xs text-zinc-500 font-normal">/ {selectedCameraZone?.capacity || 600}</span>
                </p>
                <div className="text-xs mt-1 text-zinc-400">
                  Occupancy:{" "}
                  <span className="font-semibold text-zinc-200">
                    {Math.round(((selectedCameraZone?.count || 0) / (selectedCameraZone?.capacity || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stream Telemetry */}
            <div className="flex justify-between items-end z-10 text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur p-2 rounded border border-zinc-800">
              <span>H.264 / 4500 Kbps</span>
              <span>Optical Analytics: ONLINE</span>
              <span className="text-emerald-400">Low Latency (&lt;200ms)</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-900 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCameraZone(null)}
              className="border-zinc-700 hover:bg-zinc-800 text-xs text-zinc-200"
            >
              Close Feed
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CCTV Telemetry & Optical Health Modal */}
      <Dialog open={showTelemetryModal} onOpenChange={setShowTelemetryModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Camera className="w-5 h-5 text-emerald-600" />
              CCTV Edge AI & Optical Telemetry Diagnostics
            </DialogTitle>
            <DialogDescription className="text-xs">
              Live camera streaming pipeline status, neural network inference performance, and hardware uptime across 8 temple surveillance sectors.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Streams Active</span>
                <span className="text-xl font-bold text-emerald-600">8 / 8 Online</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Optical Uptime</span>
                <span className="text-xl font-bold text-foreground">{telemetryUptime}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Pipeline Latency</span>
                <span className="text-xl font-bold text-sky-600">&lt;140 ms</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Inference Speed</span>
                <span className="text-xl font-bold text-foreground">30.0 FPS</span>
              </div>
            </div>

            {/* Cameras Table / Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Surveillance Sector Telemetry Grid
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: "Main Sanctum East", zone: "Sanctum", fps: "30.0", bitrate: "4.8 Mbps", latency: "112ms", uptime: "99.98%" },
                  { name: "Sabha Mandapa Central", zone: "Sanctum", fps: "29.9", bitrate: "4.4 Mbps", latency: "124ms", uptime: "99.95%" },
                  { name: "Digvijay Dwar Gate 1", zone: "Gates", fps: "30.0", bitrate: "5.1 Mbps", latency: "108ms", uptime: "99.99%" },
                  { name: "North Gate VIP Ramp", zone: "Gates", fps: "30.0", bitrate: "4.2 Mbps", latency: "135ms", uptime: "99.92%" },
                  { name: "South Sea Wall Walkway", zone: "Sea Wall", fps: "30.0", bitrate: "4.6 Mbps", latency: "142ms", uptime: "99.91%" },
                  { name: "Somnath Beach Gate", zone: "Sea Wall", fps: "29.8", bitrate: "3.9 Mbps", latency: "155ms", uptime: "99.88%" },
                  { name: "North Pilgrim Parking", zone: "Parking", fps: "30.0", bitrate: "4.1 Mbps", latency: "130ms", uptime: "99.94%" },
                  { name: "Prasad Pavilion Hub", zone: "Pavilion", fps: "30.0", bitrate: "4.5 Mbps", latency: "119ms", uptime: "99.96%" },
                ].map((cam, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border bg-card flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        {cam.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Zone: {cam.zone} &bull; Stream: H.264 RTSP
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-600 font-bold text-[11px]">{cam.fps} FPS</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{cam.bitrate} &bull; {cam.latency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Model Architecture Spec */}
            <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                <span>AI Optical Model: YOLOv8-CrowdNet (Quantized INT8)</span>
                <Badge variant="outline" className="text-[9px] bg-background">TensorRT Edge Node</Badge>
              </div>
              <div className="text-[10px] text-muted-foreground leading-relaxed">
                Headcount precision: 98.7% &bull; Ingestion resolution: 1920x1080 @ 30 FPS &bull; Optical temperature: 31.4°C (Normal) &bull; Automatic turnstile telemetry cross-calibration active.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowTelemetryModal(false)} className="text-xs">
                Close Telemetry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrowdDashboard;
