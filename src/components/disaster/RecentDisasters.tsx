import type { DisasterEvent } from '@/types';
import { mockRecentDisasterEvents } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, MapPin, Gauge, Clock, Waves, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentDisasters() {
  const disasterEvents: DisasterEvent[] = mockRecentDisasterEvents; // Using mock data

  const getIconForDisasterType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'earthquake':
        return <Waves className="mr-2 h-4 w-4" />;
      // Add cases for other disaster types here
      // case 'flood':
      //   return <SomeFloodIcon className="mr-2 h-4 w-4" />;
      default:
        return <AlertTriangle className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ListChecks className="mr-2 h-6 w-6 text-accent" />
          Recent Disaster Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {disasterEvents.length === 0 ? (
          <p className="text-muted-foreground">No recent disaster events to display.</p>
        ) : (
          <ul className="space-y-4">
            {disasterEvents.map((event) => (
              <li key={event.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg text-primary-foreground">{event.place}</h3>
                  <span className="text-accent font-bold text-xl flex items-center">
                    {event.type === 'earthquake' && <Gauge className="mr-1 h-5 w-5" />} M {event.magnitude.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground capitalize mb-1">{event.type}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> 
                    {formatDistanceToNow(new Date(event.time), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> 
                    Lat: {event.coordinates.latitude.toFixed(2)}, Lon: {event.coordinates.longitude.toFixed(2)}
                  </div>
                  {event.type === 'earthquake' && (
                    <div className="flex items-center">
                      {getIconForDisasterType(event.type)}
                      Depth: {event.depth.toFixed(1)} km
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
