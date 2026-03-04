import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  Download,
  FileSpreadsheet,
  Sparkles,
  Zap,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState("daily");
  const [timeRange, setTimeRange] = useState("week");
  const [auspiciousFilter, setAuspiciousFilter] = useState("all");

  const auspiciousComparisonData = [
    { dayType: "Somvar (Mondays)", normal: 12500, auspicious: 28500, multiplier: "2.3x", queueWait: "45 min", category: "Weekly Somvars" },
    { dayType: "Maha Shivratri", normal: 14000, auspicious: 85000, multiplier: "6.1x", queueWait: "120 min", category: "Major Festivals" },
    { dayType: "Kartik Purnima", normal: 13500, auspicious: 45000, multiplier: "3.3x", queueWait: "75 min", category: "Major Festivals" },
    { dayType: "Shravan Somvar", normal: 12000, auspicious: 42000, multiplier: "3.5x", queueWait: "65 min", category: "Major Festivals" },
    { dayType: "Amavasya (New Moon)", normal: 11000, auspicious: 24000, multiplier: "2.2x", queueWait: "40 min", category: "Tithi Cycles" },
    { dayType: "Purnima (Full Moon)", normal: 13000, auspicious: 32000, multiplier: "2.5x", queueWait: "50 min", category: "Tithi Cycles" },
  ];

  const hourlyPredictionData = [
    { hour: "05:00", actual: 120, predicted: 110, waitMin: 5, aarti: "Pre-Dawn" },
    { hour: "06:00", actual: 380, predicted: 350, waitMin: 15, aarti: "" },
    { hour: "07:00", actual: 780, predicted: 760, waitMin: 35, aarti: "Mangla Aarti" },
    { hour: "08:00", actual: 640, predicted: 660, waitMin: 28, aarti: "" },
    { hour: "09:00", actual: 590, predicted: 610, waitMin: 25, aarti: "" },
    { hour: "10:00", actual: 710, predicted: 730, waitMin: 32, aarti: "" },
    { hour: "11:00", actual: 860, predicted: 840, waitMin: 42, aarti: "" },
    { hour: "12:00", actual: 950, predicted: 980, waitMin: 55, aarti: "Bhog / Shringar" },
    { hour: "13:00", actual: 620, predicted: 650, waitMin: 25, aarti: "" },
    { hour: "14:00", actual: 480, predicted: 500, waitMin: 18, aarti: "" },
    { hour: "15:00", actual: 520, predicted: 540, waitMin: 20, aarti: "" },
    { hour: "16:00", actual: 690, predicted: 710, waitMin: 30, aarti: "" },
    { hour: "17:00", actual: 830, predicted: 810, waitMin: 40, aarti: "" },
    { hour: "18:00", actual: 920, predicted: 940, waitMin: 48, aarti: "" },
    { hour: "19:00", actual: 1040, predicted: 1080, waitMin: 60, aarti: "Sandhya Aarti" },
    { hour: "20:00", actual: 810, predicted: 830, waitMin: 38, aarti: "" },
    { hour: "21:00", actual: 520, predicted: 500, waitMin: 20, aarti: "" },
    { hour: "22:00", actual: 280, predicted: 260, waitMin: 10, aarti: "Shayan Aarti" },
  ];

  const handleExportCSV = () => {
    const headers = "Hour,Crowd,Capacity\n";
    const rows = dailyCrowdData.map((d) => `${d.time},${d.crowd},${d.capacity}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `somnath-crowd-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dailyCrowdData = [
    { time: "6 AM", crowd: 150, capacity: 500 },
    { time: "8 AM", crowd: 450, capacity: 500 },
    { time: "10 AM", crowd: 380, capacity: 500 },
    { time: "12 PM", crowd: 490, capacity: 500 },
    { time: "2 PM", crowd: 320, capacity: 500 },
    { time: "4 PM", crowd: 410, capacity: 500 },
    { time: "6 PM", crowd: 470, capacity: 500 },
    { time: "8 PM", crowd: 350, capacity: 500 },
    { time: "10 PM", crowd: 100, capacity: 500 },
  ];

  const weeklyCrowdData = [
    { day: "Mon", crowd: 2800, bookings: 450 },
    { day: "Tue", crowd: 2400, bookings: 380 },
    { day: "Wed", crowd: 2200, bookings: 320 },
    { day: "Thu", crowd: 2900, bookings: 490 },
    { day: "Fri", crowd: 3400, bookings: 650 },
    { day: "Sat", crowd: 4200, bookings: 890 },
    { day: "Sun", crowd: 4800, bookings: 1200 },
  ];

  const monthlyCrowdData = [
    { month: "Jan", crowd: 15000, bookings: 2300 },
    { month: "Feb", crowd: 12000, bookings: 1800 },
    { month: "Mar", crowd: 18000, bookings: 2700 },
    { month: "Apr", crowd: 22000, bookings: 3300 },
    { month: "May", crowd: 19000, bookings: 2800 },
    { month: "Jun", crowd: 14000, bookings: 2100 },
    { month: "Jul", crowd: 16000, bookings: 2400 },
    { month: "Aug", crowd: 17000, bookings: 2600 },
    { month: "Sep", crowd: 19000, bookings: 2850 },
    { month: "Oct", crowd: 21000, bookings: 3200 },
    { month: "Nov", crowd: 20000, bookings: 3000 },
    { month: "Dec", crowd: 25000, bookings: 3800 },
  ];

  const zoneDistribution = [
    { name: "Main Sanctum", value: 35, color: "#dc2626" },
    { name: "Mandapa", value: 20, color: "#ea580c" },
    { name: "Circumambulation", value: 25, color: "#f59e0b" },
    { name: "Entrance", value: 20, color: "#10b981" },
  ];

  const visitorSource = [
    { name: "Online Booking", value: 45, color: "#3b82f6" },
    { name: "Direct Darshan", value: 35, color: "#8b5cf6" },
    { name: "Group Tours", value: 15, color: "#ec4899" },
    { name: "Recurring", value: 5, color: "#06b6d4" },
  ];

  const peakHours = [
    { hour: "6-8 AM", crowd: "High", icon: "🌅", percentage: 65 },
    { hour: "8-10 AM", crowd: "Very High", icon: "⛅", percentage: 90 },
    { hour: "10 AM-12 PM", crowd: "High", icon: "☀️", percentage: 70 },
    { hour: "12-2 PM", crowd: "Very High", icon: "🌞", percentage: 95 },
    { hour: "2-4 PM", crowd: "Moderate", icon: "🌤️", percentage: 45 },
    { hour: "4-6 PM", crowd: "High", icon: "🌥️", percentage: 75 },
    { hour: "6-8 PM", crowd: "Very High", icon: "🌆", percentage: 88 },
    { hour: "8-10 PM", crowd: "Moderate", icon: "🌃", percentage: 50 },
  ];

  const bookingStats = [
    { type: "Completed", count: 1245, percentage: 75, color: "#10b981" },
    { type: "Pending", count: 324, percentage: 20, color: "#f59e0b" },
    { type: "Cancelled", count: 81, percentage: 5, color: "#ef4444" },
  ];

  const currentStats = {
    currentCrowd: 285,
    capacity: 500,
    occupancyPercent: 57,
    avgWaitTime: "12 minutes",
    todayVisitors: 1850,
    todayBookings: 450,
  };

  const getCrowdColor = (percentage) => {
    if (percentage > 80) return "bg-red-100 text-red-800 border-red-300";
    if (percentage > 60)
      return "bg-orange-100 text-orange-800 border-orange-300";
    if (percentage > 40)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getChartData = () => {
    switch (timeRange) {
      case "day":
        return dailyCrowdData;
      case "month":
        return monthlyCrowdData;
      default:
        return weeklyCrowdData;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-peaceful min-h-screen">
      <div className="flex flex-col justify-between items-start md:items-center md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Activity className="w-8 h-8 mr-3 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time crowd insights and booking analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-gradient-sacred flex items-center"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-temple">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Occupancy
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {currentStats.currentCrowd}/{currentStats.capacity}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-30" />
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-sacred h-full transition-all"
                style={{ width: `${currentStats.occupancyPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {currentStats.occupancyPercent}% Capacity
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Avg Wait Time
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {currentStats.avgWaitTime}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-30" />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-green-600">
              ✓ Within normal range
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Today's Visitors
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {currentStats.todayVisitors}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-30" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-temple">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Today's Bookings
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {currentStats.todayBookings}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500 opacity-30" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              450 completed, 0 cancelled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sacred">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Crowd Flow Analytics</CardTitle>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange("day")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeRange === "day"
                    ? "bg-gradient-sacred text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeRange === "week"
                    ? "bg-gradient-sacred text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeRange === "month"
                    ? "bg-gradient-sacred text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Monthly
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {timeRange === "day" ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyCrowdData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="crowd"
                    stroke="#dc2626"
                    name="Current Crowd"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="#9ca3af"
                    name="Capacity"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === "week" ? "day" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="crowd" fill="#dc2626" name="Crowd" />
                  <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sacred">
          <CardHeader>
            <CardTitle>Zone Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={zoneDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {zoneDistribution.map((zone) => (
                <div
                  key={zone.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span>{zone.name}</span>
                  </div>
                  <span className="font-semibold">{zone.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Hour-by-Hour Crowd Influx Prediction & Queue Forecast */}
      <Card className="shadow-sacred border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-lg gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              AI Hour-by-Hour Crowd Influx Prediction & Queue Forecast
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Deep Neural Network model forecasting today's 05:00 to 22:00 darshan influx vs actual turnstile telemetry (94.6% Confidence)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-xs">
              Model: CrowdNet-LSTM v2.4
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Real-time Influx Variance: ±3.8%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPredictionData}>
                <defs>
                  <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} Pilgrims`,
                    name === "predicted" ? "Predicted Influx" : "Actual Turnstile Inflow",
                  ]}
                  labelFormatter={(label) => {
                    const item = hourlyPredictionData.find((d) => d.hour === label);
                    return `${label} ${item?.aarti ? `(${item.aarti})` : ""} — Projected Wait: ${item?.waitMin} min`;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#predictedGrad)"
                  name="AI Predicted Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                  name="Live Actual Inflow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Insights & Peak Advisory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/20">
              <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                ⚠️ Peak Aarti Influx Warning
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Major surge projected at <strong>12:00 PM Bhog (~980)</strong> and <strong>19:00 PM Sandhya Aarti (~1,080)</strong>. Expect queues exceeding 55 minutes.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                🟢 Optimal Low-Wait Slots
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Recommended darshan slots: <strong>05:00 - 06:30 AM (Dawn)</strong> and <strong>01:30 - 03:30 PM (Afternoon)</strong> with average wait times under 18 minutes.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-sky-500/10 border-sky-500/20">
              <span className="font-semibold text-sky-800 dark:text-sky-300 block mb-1">
                ⚡ Turnstile AI Auto-Balancing
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Automated redirection triggers Gate 2 VIP/Divyang bypass when Gate 1 promenade exceeds 850 pilgrims/hr.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sacred">
          <CardHeader>
            <CardTitle>Visitor Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={visitorSource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {visitorSource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {visitorSource.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: source.color }}
                    />
                    <span>{source.name}</span>
                  </div>
                  <span className="font-semibold">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sacred">
          <CardHeader>
            <CardTitle>Peak Hours & Crowd Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHours.map((hour, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{hour.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {hour.hour}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hour.crowd}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          hour.percentage > 80
                            ? "bg-red-500"
                            : hour.percentage > 60
                              ? "bg-orange-500"
                              : hour.percentage > 40
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                        style={{ width: `${hour.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hour.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auspicious Day vs Normal Day Comparison Bar Chart */}
      <Card className="shadow-sacred border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-lg gap-2 text-foreground">
              <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
              Auspicious Festival Day vs. Regular Day Footfall Surge
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Historical crowd comparative analytics demonstrating peak footfall multipliers on sacred tithis against normal weekday baseline
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {["all", "Major Festivals", "Weekly Somvars", "Tithi Cycles"].map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={auspiciousFilter === cat ? "default" : "outline"}
                className={`h-7 text-xs px-2.5 ${
                  auspiciousFilter === cat ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
                }`}
                onClick={() => setAuspiciousFilter(cat)}
              >
                {cat === "all" ? "All Occasions" : cat}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={auspiciousComparisonData.filter(
                  (d) => (auspiciousFilter === "all" ? true : d.category === auspiciousFilter)
                )}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="dayType" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} Pilgrims`,
                    name === "auspicious" ? "Auspicious Surge Volume" : "Weekday Baseline Average",
                  ]}
                  labelFormatter={(label) => {
                    const item = auspiciousComparisonData.find((d) => d.dayType === label);
                    return `${label} — Influx Multiplier: ${item?.multiplier} (Avg Wait: ${item?.queueWait})`;
                  }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                <Bar dataKey="normal" fill="#94a3b8" name="Normal Weekday Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="auspicious" fill="#ea580c" name="Sacred Festival Surge" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Surge Comparative Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg border bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Peak Surge Multiplier</span>
              <span className="text-xl font-bold text-amber-600">6.1x (Maha Shivratri)</span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">85,000+ devotees over 24 hrs</span>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Average Holy Day Surge</span>
              <span className="text-xl font-bold text-foreground">+240% Inflow</span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Across Somvar & Purnima cycles</span>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Queue Mitigation Protocol</span>
              <span className="text-xl font-bold text-emerald-600">3-Tier Staggering</span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Automated bypass & prasad hold bays</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-temple">
        <CardHeader>
          <CardTitle>Booking Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookingStats.map((stat) => (
              <div
                key={stat.type}
                className="p-4 rounded-lg border-2"
                style={{
                  borderColor: stat.color,
                  backgroundColor: stat.color + "15",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{stat.type}</h4>
                  <Badge
                    style={{ backgroundColor: stat.color, color: "white" }}
                  >
                    {stat.percentage}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.count}
                </p>
                <div className="mt-3 w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      backgroundColor: stat.color,
                      width: `${stat.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-temple bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <AlertCircle className="w-5 h-5 mr-2" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                Peak hours are 8-10 AM and 12-2 PM. Consider staggered darshan
                timings.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                Zone distribution is balanced with 35% in main sanctum,
                preventing congestion.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                Online bookings account for 45% of visitors - increase digital
                promotion.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                Weekend crowd increases by 40% - prepare additional staff and
                resources.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
