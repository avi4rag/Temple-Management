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
  UserX,
  Megaphone,
  Waves,
  ShieldAlert,
  LifeBuoy,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/services/alertService";
import { weatherService } from "@/services/weatherService";
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
  const [showLostPersonModal, setShowLostPersonModal] = useState(false);
  const [lostPersonData, setLostPersonData] = useState({
    name: "",
    age: "",
    lastSeen: "Sanctum Outer Queue",
    guardianPhone: "",
    clothing: "",
  });
  const [formData, setFormData] = useState({
    type: "medical",
    severity: "medium",
    description: "",
  });
  const [expandedFaq, setExpandedFaq] = useState(null);

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
    { name: "National Emergency", number: "112", icon: "🚨", desc: "Immediate Police/Fire/Medical SOS" },
    { name: "Police Control", number: "100", icon: "🚓", desc: "Prabhas Patan Police Station" },
    { name: "Emergency Ambulance", number: "108", icon: "🚑", desc: "Gujarat State Emergency Service" },
    { name: "Temple Security Control", number: "+91-2876-231200", icon: "🛡️", desc: "Shree Somnath Trust Control Room" },
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
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLostPersonModal(true)}
            className="border-amber-500/50 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <UserX className="w-4 h-4 mr-2 text-amber-600" />
            Report Lost Child / Devotee
          </Button>
          <Button
            onClick={() => setShowReportForm(!showReportForm)}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Emergency
          </Button>
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyContacts.map((contact) => (
          <Card
            key={contact.name}
            className="hover:shadow-lg transition-all border-destructive/20 hover:border-destructive/50"
          >
            <CardContent className="p-4 text-center flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl mb-1.5">{contact.icon}</div>
                <h4 className="font-semibold text-foreground text-sm">
                  {contact.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {contact.desc}
                </p>
                <p className="text-lg font-bold font-mono text-destructive mt-1">
                  {contact.number}
                </p>
              </div>
              <a
                href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                className="mt-3 block"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs hover:bg-destructive hover:text-white border-destructive/40"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-destructive group-hover:text-white" />
                  Call Now
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Emergency Assistance & Protocol FAQ */}
      <Card className="border-border/70 shadow-sm bg-gradient-to-r from-amber-500/5 via-primary/5 to-transparent">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Pilgrim Assistance & Incident Protocols</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              Trust Standard Operating Procedures
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          {[
            {
              id: "med",
              q: "Where is the nearest Medical First Aid & Doctor Post?",
              a: "Shree Somnath Trust Free 24x7 Medical Dispensary is located right beside Digvijay Dwar (Gate 2) with on-duty physicians, emergency oxygen, and 108 ICU ambulance bay.",
              action: "Gate 2 (Digvijay Dwar)",
            },
            {
              id: "lost",
              q: "What to do if a child or elderly relative gets separated?",
              a: "Immediately inform the North Gate Central Security Control. A high-priority PA system announcement will be broadcast across all 6 zones in Gujarati, Hindi, and English, and camera tracking activated.",
              action: "Report via 'Report Missing Person' button above",
            },
            {
              id: "items",
              q: "Where to deposit mobile phones and leather items?",
              a: "Free electronic lockers and cloakrooms are operational outside Gate 1 and Gate 2. DEVOTEES MUST NOT carry mobile phones inside the queue complex.",
              action: "Free Cloakroom Counters 1-8",
            },
            {
              id: "wheelchair",
              q: "Are wheelchairs or battery carts available for disabled devotees?",
              a: "Yes! Complimentary wheelchairs and electric golf-carts are parked at Digvijay Dwar and can be requested from Sevaks free of charge for senior citizens (65+) and Divyang devotees.",
              action: "Request at Information Booth",
            },
          ].map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div key={faq.id} className="border rounded-md bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full p-2.5 text-left flex items-center justify-between gap-2 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">ℹ</span>
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-2.5 pt-0 text-[11px] text-muted-foreground border-t bg-muted/20 space-y-1">
                    <p>{faq.a}</p>
                    <div className="text-[10px] font-semibold text-primary pt-0.5">
                      📍 Location / Action: {faq.action}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

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

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Designated Safe Evacuation Assembly Zones & First-Aid Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/60 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Zone A: Seaface Promenade</span>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">Open</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Direct exit via West Corridor. Capacity: 3,500 pilgrims. Equipped with emergency drinking water station.</p>
            </div>
            <div className="p-3 bg-muted/60 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Zone B: South Garden Court</span>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">Open</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Exit via Sabha Mandapa South. Capacity: 2,500 pilgrims. Medical First-Aid Post 1 with oxygen & stretcher.</p>
            </div>
            <div className="p-3 bg-muted/60 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Zone C: East Plaza Terminal</span>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">Open</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Exit via East Gateway. Capacity: 4,000 pilgrims. Emergency ambulance bay & police dispatch post.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coastal Marine Rescue & Arabian Sea Safety Desk */}
      <Card className="border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-sky-800 dark:text-sky-300">
              <LifeBuoy className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Arabian Sea Coastal Safety & Marine Rescue Unit
            </CardTitle>
            <Badge variant="outline" className="text-xs bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300">
              Coast Guard & Marine Police
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Somnath sanctum is bordered by open sea waters. Marine patrols are stationed at Baan Stambh and the South Sea Promenade with high-tide alert sirens and motorized rescue skiffs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weatherService.getMarineSafetyHotlines().map((hl, idx) => (
              <div key={idx} className="p-3 bg-background/80 rounded-lg border text-xs space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-sky-500" />
                  <span>{hl.title}</span>
                </div>
                <div className="font-mono text-primary font-bold">{hl.phone}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Protocol:</strong> In case of life-threatening emergencies,
          always call 112 (National SOS) or 108 (Gujarat Ambulance) immediately. Temple control room staff monitor all alerts 24/7.
        </AlertDescription>
      </Alert>

      {/* Lost Child & Missing Devotee Modal */}
      <Dialog
        open={showLostPersonModal}
        onOpenChange={setShowLostPersonModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Megaphone className="w-5 h-5 text-amber-600" />
              Report Lost Child / Missing Devotee
            </DialogTitle>
            <DialogDescription>
              Broadcasted immediately to Temple PA announcers, Security Patrol, and Digvijay Dwar Helpdesk.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!lostPersonData.name || !lostPersonData.guardianPhone) {
                toast({
                  title: "Required Information Missing",
                  description: "Please provide the person's name and a contact phone number.",
                  variant: "destructive",
                });
                return;
              }

              reportMutation.mutate({
                type: "lost_found",
                severity: "high",
                title: `MISSING PERSON: ${lostPersonData.name}`,
                description: `Age: ${lostPersonData.age || 'N/A'}. Last seen at: ${lostPersonData.lastSeen}. Clothing/Details: ${lostPersonData.clothing || 'Not specified'}. Contact Guardian: ${lostPersonData.guardianPhone}`,
                location: lostPersonData.lastSeen,
                zoneId: "lost_found",
              });

              toast({
                title: "Report Dispatched to Control Room",
                description: "Security personnel and PA announcement booth have been alerted. Please proceed to Digvijay Dwar Information Desk.",
              });

              setShowLostPersonModal(false);
              setLostPersonData({
                name: "",
                age: "",
                lastSeen: "Sanctum Outer Queue",
                guardianPhone: "",
                clothing: "",
              });
            }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="missing-name" className="text-xs">Missing Person's Name *</Label>
                <Input
                  id="missing-name"
                  placeholder="e.g. Aarav Sharma"
                  value={lostPersonData.name}
                  onChange={(e) => setLostPersonData({ ...lostPersonData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="missing-age" className="text-xs">Approximate Age</Label>
                <Input
                  id="missing-age"
                  type="number"
                  placeholder="e.g. 7"
                  value={lostPersonData.age}
                  onChange={(e) => setLostPersonData({ ...lostPersonData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="last-seen" className="text-xs">Last Seen Location *</Label>
              <select
                id="last-seen"
                value={lostPersonData.lastSeen}
                onChange={(e) => setLostPersonData({ ...lostPersonData, lastSeen: e.target.value })}
                className="w-full h-10 px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="Sanctum Outer Queue">Sanctum Outer Queue</option>
                <option value="Sabha Mandapa">Sabha Mandapa</option>
                <option value="Pradakshina Path">Pradakshina Path</option>
                <option value="Main Entrance Gate 1">Main Entrance Gate 1</option>
                <option value="Digvijay Dwar (Gate 2)">Digvijay Dwar (Gate 2)</option>
                <option value="Somnath Bhojanalaya">Somnath Bhojanalaya</option>
                <option value="Shoe Stand / Cloakroom">Shoe Stand / Cloakroom</option>
                <option value="Seaface Promenade">Seaface Promenade</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="guardian-phone" className="text-xs">Guardian / Contact Phone *</Label>
              <Input
                id="guardian-phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={lostPersonData.guardianPhone}
                onChange={(e) => setLostPersonData({ ...lostPersonData, guardianPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="clothing-desc" className="text-xs">Clothing & Identifying Marks</Label>
              <Input
                id="clothing-desc"
                placeholder="e.g. Yellow kurta, white pyjama, red cap"
                value={lostPersonData.clothing}
                onChange={(e) => setLostPersonData({ ...lostPersonData, clothing: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLostPersonModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Megaphone className="w-3.5 h-3.5 mr-1" />
                Broadcast Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyAlert;
