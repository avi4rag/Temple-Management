import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  Clock,
  MapPin,
  AlertTriangle,
  Info,
  Languages,
  ChevronDown,
  Users,
  Shield,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Navigation = ({ activeSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const currentLangOption = languages.find(
    (lang) => lang.code === currentLanguage,
  );

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(langSearch.toLowerCase()),
  );

  const navItems = [
    {
      id: "dashboard",
      label: t("nav.crowdDashboard") || "Live Crowd",
      icon: Users,
    },
    {
      id: "queue",
      label: t("nav.darshanQueue"),
      icon: Clock,
    },
    {
      id: "navigation",
      label: t("nav.templeMap"),
      icon: MapPin,
    },
    {
      id: "emergency",
      label: t("nav.emergency"),
      icon: AlertTriangle,
    },
    {
      id: "services",
      label: t("nav.services"),
      icon: Info,
    },
  ];

  const handleNavigation = (section) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleHomeNavigation = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLangOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sacred">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleHomeNavigation}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-sacred rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Divya Setu
                </h1>

                <p className="text-sm text-muted-foreground">
                  Temple Management System
                </p>
              </div>
            </button>

            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.id)}
                    className={cn(
                      "flex items-center space-x-2 transition-sacred",
                      activeSection === item.id &&
                        "bg-gradient-sacred shadow-sacred",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <Languages className="w-3 h-3 mr-1" />
                    {currentLangOption?.nativeName}
                    <ChevronDown className="w-2 h-2 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        currentLanguage === language.code && "bg-accent",
                      )}
                    >
                      <span>{language.name}</span>

                      <span className="text-sm text-muted-foreground">
                        {language.nativeName}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <div className="border-t my-1" />
                  <DropdownMenuItem
                    onClick={() => {
                      setIsLangOpen(false);
                      setIsLanguageModalOpen(true);
                    }}
                    className="cursor-pointer text-xs font-medium text-primary flex items-center justify-center py-1.5"
                  >
                    <Languages className="w-3.5 h-3.5 mr-1" />
                    Browse All Languages ({languages.length})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/login")}
                className="text-xs px-2.5 py-1 flex items-center border-primary/20 hover:bg-primary/5"
              >
                <Shield className="w-3.5 h-3.5 mr-1 text-primary" />
                Staff Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleHomeNavigation}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-sacred rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>

              <h1 className="text-lg font-bold text-foreground">Divya Setu</h1>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="bg-background border-t border-border shadow-temple">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.id)}
                    className={cn(
                      "w-full justify-start space-x-3 transition-sacred",
                      activeSection === item.id &&
                        "bg-gradient-sacred shadow-sacred",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}

              <div className="pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      setIsLanguageModalOpen(true);
                    }}
                  >
                    <Languages className="w-4 h-4 mr-2 text-primary" />
                    {t("nav.language")}: {currentLangOption?.nativeName}
                  </Button>
                </div>

                <div className="pt-2 border-t mt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      navigate("/admin/login");
                      setIsOpen(false);
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Staff Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Language Selection Modal */}
      <Dialog
        open={isLanguageModalOpen}
        onOpenChange={setIsLanguageModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Languages className="w-5 h-5 text-primary" />
              Select Devotee Language / भाषा चुनें
            </DialogTitle>
            <DialogDescription>
              Choose your preferred regional language for real-time announcements, virtual tokens, and crowd maps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Input
              placeholder="Search language / भाषा खोजें..."
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className="text-sm"
            />

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredLanguages.map((language) => {
                const isSelected = currentLanguage === language.code;
                return (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => {
                      handleLanguageChange(language.code);
                      setIsLanguageModalOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40 font-semibold"
                        : "border-border bg-card",
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {language.name}
                    </span>
                    <span className="text-base text-primary mt-0.5">
                      {language.nativeName}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider mt-1">
                        Active Language
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;
