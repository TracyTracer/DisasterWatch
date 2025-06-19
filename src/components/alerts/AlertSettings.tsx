"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BellRing, MapPin, Gauge } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function AlertSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [location, setLocation] = useState("Yangon, Myanmar"); // Updated default location
  const [magnitudeThreshold, setMagnitudeThreshold] = useState(4.5);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    // In a real app, this would save to a backend.
    console.log("Alert settings saved:", { notificationsEnabled, location, magnitudeThreshold });
    toast({
      title: "Settings Saved",
      description: "Your alert preferences have been updated (simulation).",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <BellRing className="mr-2 h-6 w-6 text-accent" />
          Disaster Alert Settings
        </CardTitle>
        <CardDescription>
          Configure your preferences for disaster notifications (simulated).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 p-3 border border-border rounded-lg">
          <Label htmlFor="notifications-enabled" className="flex flex-col space-y-1">
            <span>Enable Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive alerts for significant disaster events.
            </span>
          </Label>
          <Switch
            id="notifications-enabled"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
            aria-label="Enable or disable notifications"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alert-location" className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground"/>Location for Alerts</Label>
          <Input
            id="alert-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Your City, Country"
            disabled={!notificationsEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="magnitude-threshold" className="flex items-center"><Gauge className="mr-2 h-4 w-4 text-muted-foreground"/>Minimum Severity / Magnitude</Label>
          <Input
            id="magnitude-threshold"
            type="number"
            value={magnitudeThreshold}
            onChange={(e) => setMagnitudeThreshold(parseFloat(e.target.value))}
            step="0.1"
            min="0"
            max="10" // This max might need to change for other disaster types
            placeholder="e.g., 4.0 for quakes"
            disabled={!notificationsEnabled}
          />
           <p className="text-xs text-muted-foreground">
            Receive alerts for events with severity/magnitude {magnitudeThreshold.toFixed(1)} or higher.
          </p>
        </div>
        
        <Button onClick={handleSaveChanges} className="w-full" disabled={!notificationsEnabled}>
          Save Alert Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
