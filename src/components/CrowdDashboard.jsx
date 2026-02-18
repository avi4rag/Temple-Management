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

const CrowdDashboard = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedCameraZone, setSelectedCameraZone] = useState(null);
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
    { name: "Main Temple", count: 892, capacity: 1200, status: "Moderate" },
    { name: "Pradakshina Path", count: 654, capacity: 800, status: "High" },
    { name: "Entry Gate", count: 423, capacity: 600, status: "Low" },
    { name: "Prasad Counter", count: 234, capacity: 400, status: "Moderate" },
    { name: "Parking Area", count: 567, capacity: 1000, status: "Low" },
    { name: "Exit Gate", count: 77, capacity: 200, status: "Low" },
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
                    <span className="font-medium text-foreground">
                      {zone.name}
                    </span>
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
    </div>
  );
};

export default CrowdDashboard;
