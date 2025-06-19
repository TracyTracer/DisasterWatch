
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Siren, PhoneCall, ShieldAlert, Info } from 'lucide-react';

const emergencyContacts = [
  { name: "National Emergency Hotline (General)", number: "911 / 112 (varies by country)", details: "For any immediate life-threatening situation." },
  { name: "Myanmar Police Force", number: "199", details: "For crimes and public safety concerns in Myanmar." },
  { name: "Myanmar Fire Services Department", number: "191", details: "For fire emergencies in Myanmar." },
  { name: "Myanmar Ambulance / Medical Emergency", number: "192", details: "For urgent medical help in Myanmar."},
];

export function EmergencyHelp() {
  const { toast } = useToast();

  const handleSimulateCall = (contactName: string) => {
    toast({
      title: "Emergency Action (Simulated)",
      description: `Simulating contact with ${contactName}. In a real emergency, please use your phone to dial the appropriate number directly.`,
      duration: 5000,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Siren className="mr-2 h-6 w-6 text-destructive" />
          Emergency Assistance
        </CardTitle>
        <CardDescription>
          Quick access to emergency information. In a real emergency, dial numbers directly using your phone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-2 flex items-center">
            <Info className="mr-2 h-5 w-5 text-accent" />
            Important Contacts
          </h4>
          <ul className="space-y-3">
            {emergencyContacts.map((contact) => (
              <li key={contact.name} className="p-3 border border-border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-primary-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.details}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSimulateCall(contact.name)}
                    className="ml-2 whitespace-nowrap"
                    aria-label={`Simulate call to ${contact.name} at ${contact.number}`}
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4" /> {contact.number}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-border pt-4">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-accent" />
                Immediate Danger?
            </h4>
            <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => handleSimulateCall("General Emergency Services")}
                aria-label="Simulate call to general emergency services"
            >
                <Siren className="mr-2 h-5 w-5" /> Request Immediate Help (Simulated)
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                This is a simulation. Always use your phone for actual emergency calls.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
