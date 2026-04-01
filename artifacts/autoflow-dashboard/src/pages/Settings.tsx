import React from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme, ColorTheme } from "@/lib/theme";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Bell, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COLOR_THEMES: { id: ColorTheme; label: string; from: string; to: string; dot: string }[] = [
  { id: "blue",   label: "Ocean Blue",   from: "from-blue-500",   to: "to-blue-700",   dot: "bg-blue-500" },
  { id: "green",  label: "Forest Green", from: "from-green-500",  to: "to-green-700",  dot: "bg-green-500" },
  { id: "purple", label: "Deep Purple",  from: "from-purple-500", to: "to-purple-700", dot: "bg-purple-500" },
  { id: "orange", label: "Sunset Orange",from: "from-orange-400", to: "to-orange-600", dot: "bg-orange-500" },
  { id: "teal",   label: "Teal Breeze",  from: "from-teal-400",   to: "to-teal-600",   dot: "bg-teal-500" },
  { id: "rose",   label: "Rose Quartz",  from: "from-rose-400",   to: "to-rose-600",   dot: "bg-rose-500" },
];

export default function Settings() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been successfully updated.",
    });
  };

  return (
    <PageWrapper className="space-y-5 max-w-3xl mx-auto p-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your dashboard preferences and display options.</p>
      </div>

      <div className="grid gap-4">
        {/* Appearance */}
        <Card className="card-premium">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </CardTitle>
            <CardDescription className="text-xs">Customize how the dashboard looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-5">
            {/* Light / Dark toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Theme Mode</Label>
              <div className="flex gap-3">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    data-testid={`button-theme-${t}`}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                      theme === t
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-border/80 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {t === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Color themes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color Theme</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {COLOR_THEMES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setColorTheme(ct.id)}
                    data-testid={`button-color-${ct.id}`}
                    className={cn(
                      "group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-150",
                      colorTheme === ct.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full bg-gradient-to-br shadow-sm transition-transform duration-150 group-hover:scale-105",
                        ct.from,
                        ct.to,
                        colorTheme === ct.id && "ring-2 ring-offset-2 ring-primary scale-110"
                      )}
                    />
                    <span className="text-[11px] font-medium text-muted-foreground leading-tight text-center">{ct.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-premium">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> Notifications
            </CardTitle>
            <CardDescription className="text-xs">Configure how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {[
              { label: "Critical System Alerts", desc: "Machine failures and emergency stops.", testId: "switch-alerts-critical", defaultChecked: true },
              { label: "Inventory Warnings", desc: "Stock levels falling below minimum thresholds.", testId: "switch-alerts-inventory", defaultChecked: true },
              { label: "Daily Summary Reports", desc: "End-of-shift summary of production metrics.", testId: "switch-alerts-daily", defaultChecked: false },
            ].map((item) => (
              <div key={item.testId} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} data-testid={item.testId} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" data-testid="button-cancel-settings">Cancel</Button>
          <Button size="sm" onClick={handleSave} data-testid="button-save-settings">
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Preferences
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
