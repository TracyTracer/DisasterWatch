import type { Earthquake } from '@/types';
import { mockRecentEarthquakes } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, MapPin, Gauge, Clock, Waves } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentQuakes() {
  const earthquakes: Earthquake[] = mockRecentEarthquakes; // Using mock data

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ListChecks className="mr-2 h-6 w-6 text-accent" />
          Recent Earthquakes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {earthquakes.length === 0 ? (
          <p className="text-muted-foreground">No recent earthquakes to display.</p>
        ) : (
          <ul className="space-y-4">
            {earthquakes.map((quake) => (
              <li key={quake.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg text-primary-foreground">{quake.place}</h3>
                  <span className="text-accent font-bold text-xl flex items-center">
                    <Gauge className="mr-1 h-5 w-5" /> M {quake.magnitude.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> 
                    {formatDistanceToNow(new Date(quake.time), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> 
                    Lat: {quake.coordinates.latitude.toFixed(2)}, Lon: {quake.coordinates.longitude.toFixed(2)}
                  </div>
                  <div className="flex items-center">
                    <Waves className="mr-2 h-4 w-4" /> 
                    Depth: {quake.depth.toFixed(1)} km
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
