
import { Header } from '@/components/layout/Header';
import { DisasterMap } from '@/components/disaster/DisasterMap';
import { RecentDisasters } from '@/components/disaster/RecentDisasters';
import { DisasterInfoForm } from '@/components/chatbot/DisasterInfoForm';
import { PersonalizedSafetyTipsForm } from '@/components/chatbot/PersonalizedSafetyTipsForm';
import { ProfessionalChat } from '@/components/chatbot/ProfessionalChat';
import { EmergencyHelp } from '@/components/emergency/EmergencyHelp';
import { AlertSettings } from '@/components/alerts/AlertSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, BellRing, Activity, LifeBuoy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column: Map */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto lg:min-h-[calc(100vh-200px)]">
            <DisasterMap />
          </div>

          {/* Right Column: Tabs for Info */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="recent-events" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-4"> {/* Updated to 4 cols */}
                <TabsTrigger value="recent-events" aria-label="Recent Events">
                  <Activity className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Recent Events</span>
                </TabsTrigger>
                <TabsTrigger value="ai-tools" aria-label="AI Tools">
                  <MessageCircle className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">AI Tools</span>
                </TabsTrigger>
                <TabsTrigger value="support" aria-label="Support"> {/* New Tab */}
                  <LifeBuoy className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Support</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" aria-label="Alert Settings">
                  <BellRing className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-grow rounded-md border border-border p-1 lg:max-h-[calc(100vh-250px)]">
                <TabsContent value="recent-events" className="mt-0 p-3">
                  <RecentDisasters />
                </TabsContent>
                <TabsContent value="ai-tools" className="mt-0 p-3 space-y-6">
                  <DisasterInfoForm />
                  <PersonalizedSafetyTipsForm />
                </TabsContent>
                <TabsContent value="support" className="mt-0 p-3 space-y-6"> {/* New Tab Content */}
                  <ProfessionalChat />
                  <EmergencyHelp />
                </TabsContent>
                <TabsContent value="alerts" className="mt-0 p-3">
                  <AlertSettings />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        DisasterWatch &copy; {new Date().getFullYear()} - Stay Safe.
      </footer>
    </div>
  );
}
