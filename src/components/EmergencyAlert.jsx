import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Users,
  Car,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/services/alertService";
import { useToast } from "@/hooks/use-toast";

const EmergencyAlert = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertService.getAlerts,
    refetchInterval: 15000,
  });

  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "medical",
    severity: "medium",
    description: "",
  });

  const reportMutation = useMutation({
    mutationFn: (newAlert) => alertService.reportAlert(newAlert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Emergency Alert Dispatched",
        description: "Temple security & medical team have been notified.",
      });
      setFormData({ type: "medical", severity: "medium", description: "" });
      setShowReportForm(false);
    },
    onError: () => {
      toast({
        title: "Report Failed",
        description: "Failed to dispatch alert. Please call the emergency hotline directly.",
        variant: "destructive",
      });
    },
  });

  const emergencyContacts = [
    { name: "Police", number: "100", icon: "🚓" },
    { name: "Ambulance", number: "102", icon: "🚑" },
    { name: "Temple Security", number: "+91-XXXX-XXXX", icon: "👮" },
    { name: "Fire Dept", number: "101", icon: "🚒" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-500";
      case "medium":
        return "bg-orange-100 border-orange-500";
      case "low":
        return "bg-yellow-100 border-yellow-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "low":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Activity className="w-4 h-4 text-red-500 animate-pulse" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "medical":
        return "🏥";
      case "crowd":
        return "👥";
      case "safety":
        return "🔒";
      case "traffic":
        return "🚗";
      case "fire":
        return "🔥";
      default:
        return "⚠️";
    }
  };

  const handleReportSubmit = () => {
    if (!formData.description.trim()) return;

    reportMutation.mutate({
      type:
        formData.type === "medical"
          ? "medical_emergency"
          : formData.type === "crowd"
          ? "stampede_risk"
          : "general",
      severity: formData.severity,
      title: `${formData.type.toUpperCase()} Incident Report`,
      description: formData.description,
      location: "Temple Premises",
      zoneId: "plaza",
    });
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-red-50/30 to-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-destructive" />
            Emergency Management
          </h1>
          <p className="text-muted-foreground">
            Real-time alert system and emergency response coordination
          </p>
        </div>
        <Button
          onClick={() => setShowReportForm(!showReportForm)}
          className="bg-destructive hover:bg-destructive/90 text-white"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Report Emergency
        </Button>
      </div>

      {showReportForm && (
        <Card className="border-2 border-destructive shadow-lg">
          <CardHeader>
            <CardTitle>Report Emergency Situation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Emergency Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
              >
                <option value="medical">Medical</option>
                <option value="crowd">Crowd Control</option>
                <option value="safety">Safety Concern</option>
                <option value="traffic">Traffic</option>
                <option value="fire">Fire</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Severity Level
              </label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Please describe the emergency situation..."
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground resize-none h-24"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleReportSubmit}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                Submit Report
              </Button>
              <Button
                onClick={() => setShowReportForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyContacts.map((contact) => (
          <Card
            key={contact.name}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{contact.icon}</div>
              <h4 className="font-semibold text-foreground text-sm">
                {contact.name}
              </h4>
              <p className="text-lg font-bold text-destructive mt-1">
                {contact.number}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeAlerts.length > 0 && (
        <Card className="border-2 border-destructive shadow-md bg-red-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-destructive">
                <Activity className="w-5 h-5 mr-2 animate-pulse" />
                Active Alerts ({activeAlerts.length})
              </CardTitle>
              <Badge className="bg-destructive text-white">URGENT</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 border-destructive ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeverityIcon(alert.severity)}
                      <h4 className="font-bold text-foreground">
                        {alert.title}
                      </h4>
                      <Badge className={getSeverityBadgeColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {getStatusIcon(alert.status)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {alert.location && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.location}
                        </span>
                      )}
                      {alert.time && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.time}
                        </span>
                      )}
                      {alert.eta && (
                        <span className="flex items-center text-destructive font-semibold">
                          <Activity className="w-3 h-3 mr-1" />
                          ETA: {alert.eta}
                        </span>
                      )}
                    </div>

                    {alert.responders && (
                      <div className="flex items-center space-x-2 mt-2 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{alert.responders} responders en route</span>
                      </div>
                    )}

                    {alert.estimatedPeople && (
                      <div className="flex items-center space-x-2 mt-2 text-xs">
                        <Users className="w-3 h-3" />
                        <span>
                          Approximately {alert.estimatedPeople} people in area
                        </span>
                      </div>
                    )}

                    {alert.action && (
                      <div className="mt-2 p-2 bg-blue-100 text-blue-800 rounded text-xs">
                        ℹ️ {alert.action}
                      </div>
                    )}

                    {alert.details && (
                      <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
                        📝 {alert.details}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="ml-2 bg-destructive hover:bg-destructive/90"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Alert History ({resolvedAlerts.length} resolved)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resolvedAlerts.length > 0 ? (
              resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg border bg-green-50/30 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-foreground">
                          {alert.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          RESOLVED
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {alert.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {alert.location}
                          </span>
                        )}
                        {alert.duration && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Resolved in {alert.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No resolved alerts
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> In case of life-threatening emergencies,
          always call 100 (Police) or 102 (Ambulance) first, then report through
          this system.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmergencyAlert;
