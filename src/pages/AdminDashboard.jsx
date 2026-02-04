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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin_user");
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    setAdminUser(JSON.parse(storedAdmin));

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const { data: camerasData, error: camerasError } = await supabase
        .from("cameras")
        .select("*")
        .eq("is_active", true);

      if (camerasError) throw camerasError;
      setCameras(camerasData || []);

      const { data: alertsData, error: alertsError } = await supabase
        .from("alerts")
        .select("*")
        .in("status", ["active", "acknowledged"])
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;
      setAlerts(alertsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({
          status: "acknowledged",
          acknowledged_by: adminUser?.id,
          acknowledged_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert Acknowledged",
        description: "Alert has been acknowledged and logged",
      });

      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

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
            <Badge variant="outline">Live Operations</Badge>
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
              <Button
                variant="outline"
                onClick={() => navigate("/admin/cameras")}
              >
                <Monitor className="mr-2 h-4 w-4" />
                Manage Cameras
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/map")}>
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
                onClick={() => navigate(`/admin/camera/${camera.id}`)}
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
            <Button variant="outline" onClick={() => navigate("/admin/alerts")}>
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
                  Next Aarti: 6:00 PM (45 minutes)
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
              <Button variant="outline" className="w-full justify-start">
                <Send className="mr-2 h-4 w-4" />
                Send Push Notification
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/queue")}
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
    </div>
  );
};

export default AdminDashboard;
