import { Header } from '@/components/layout/Header';
import { EarthquakeMap } from '@/components/earthquake/EarthquakeMap';
import { RecentQuakes } from '@/components/earthquake/RecentQuakes';
import { EarthquakeInfoForm } from '@/components/chatbot/EarthquakeInfoForm';
import { PersonalizedSafetyTipsForm } from '@/components/chatbot/PersonalizedSafetyTipsForm';
import { AlertSettings } from '@/components/alerts/AlertSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, MessageCircle, BellRing } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column: Map */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto lg:min-h-[calc(100vh-200px)]">
            <EarthquakeMap />
          </div>

          {/* Right Column: Tabs for Info */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="recent-quakes" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="recent-quakes" aria-label="Recent Quakes">
                  <ListChecks className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Recent</span>
                </TabsTrigger>
                <TabsTrigger value="ai-tools" aria-label="AI Tools">
                  <MessageCircle className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">AI Tools</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" aria-label="Alert Settings">
                  <BellRing className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-grow rounded-md border border-border p-1 lg:max-h-[calc(100vh-250px)]">
                <TabsContent value="recent-quakes" className="mt-0 p-3">
                  <RecentQuakes />
                </TabsContent>
                <TabsContent value="ai-tools" className="mt-0 p-3 space-y-6">
                  <EarthquakeInfoForm />
                  <PersonalizedSafetyTipsForm />
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
        QuakeChat &copy; {new Date().getFullYear()} - Stay Safe.
      </footer>
    </div>
  );
}
