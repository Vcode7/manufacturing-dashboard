import React from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/lib/theme";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Bell, Shield, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <PageWrapper className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your dashboard preferences and system configuration.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Appearance
            </CardTitle>
            <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">Theme Mode</Label>
              <div className="flex items-center gap-6">
                <div 
                  className={`flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                  onClick={() => setTheme("light")}
                  data-testid="button-theme-light"
                >
                  <Sun className="h-8 w-8" />
                  <span className="text-sm font-medium">Light</span>
                </div>
                <div 
                  className={`flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                  onClick={() => setTheme("dark")}
                  data-testid="button-theme-dark"
                >
                  <Moon className="h-8 w-8" />
                  <span className="text-sm font-medium">Dark</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Accent Color</Label>
              <RadioGroup 
                value={colorTheme} 
                onValueChange={(val: any) => setColorTheme(val)}
                className="flex gap-4"
              >
                {[
                  { id: "blue", label: "Blue", class: "bg-blue-600" },
                  { id: "green", label: "Green", class: "bg-green-600" },
                  { id: "purple", label: "Purple", class: "bg-purple-600" },
                  { id: "orange", label: "Orange", class: "bg-orange-500" }
                ].map(color => (
                  <div key={color.id} className="flex flex-col items-center gap-2">
                    <div 
                      className={`h-10 w-10 rounded-full cursor-pointer border-2 transition-transform ${color.class} ${colorTheme === color.id ? 'ring-2 ring-offset-2 ring-primary border-white scale-110' : 'border-transparent'}`}
                      onClick={() => setColorTheme(color.id as any)}
                      data-testid={`button-color-${color.id}`}
                    />
                    <Label className="cursor-pointer">{color.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Critical System Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive immediate notifications for machine failures.</p>
              </div>
              <Switch defaultChecked data-testid="switch-alerts-critical" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Inventory Warnings</Label>
                <p className="text-sm text-muted-foreground">Get notified when stock levels fall below minimum thresholds.</p>
              </div>
              <Switch defaultChecked data-testid="switch-alerts-inventory" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Summary Reports</Label>
                <p className="text-sm text-muted-foreground">Receive a summary of production metrics at end of shift.</p>
              </div>
              <Switch data-testid="switch-alerts-daily" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" data-testid="button-cancel-settings">Cancel</Button>
          <Button onClick={handleSave} data-testid="button-save-settings">
            <Save className="mr-2 h-4 w-4" /> Save Preferences
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
