"use client";

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { DisasterEvent } from '@/types';
import { mockDisasterMarkers } from '@/lib/mock-data'; // Using mock data
import { useEffect, useState } from 'react';

interface DisasterMapProps {
  disasterEvents?: DisasterEvent[]; // Optional prop for dynamic data in future
}

// Helper to determine marker color based on magnitude (for earthquakes)
const getMarkerColor = (magnitude: number) => {
  if (magnitude < 4) return '#4CAF50'; // Green
  if (magnitude < 6) return '#FFC107'; // Amber
  return '#F44336'; // Red
};

export function DisasterMap({ disasterEvents }: DisasterMapProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  // Default to Southeast Asia (e.g., Yangon, Myanmar)
  const [mapCenter, setMapCenter] = useState({ lat: 16.8409, lng: 96.1735 }); 
  
  const markers = disasterEvents ? disasterEvents.map(event => ({
    id: event.id,
    position: { lat: event.coordinates.latitude, lng: event.coordinates.longitude },
    title: `M ${event.magnitude} - ${event.place} (${event.type})`,
    magnitude: event.magnitude,
    type: event.type,
  })) : mockDisasterMarkers;

  useEffect(() => {
    const envApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
    } else {
      console.warn("Google Maps API Key is not set. Map functionality will be limited.");
    }

    if (markers.length > 0 && !disasterEvents) { // Only set center from mock if no specific events passed
      setMapCenter(markers[0].position);
    } else if (disasterEvents && disasterEvents.length > 0) {
      setMapCenter(disasterEvents[0].coordinates);
    }
  }, [markers, disasterEvents]);


  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted text-muted-foreground rounded-lg shadow-inner">
        <p>Loading Map... (API Key missing or loading)</p>
      </div>
    );
  }
  
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
      <APIProvider apiKey={apiKey}>
        <Map
          center={mapCenter} // Use center instead of defaultCenter for dynamic updates
          defaultZoom={5} // Zoom level adjusted for regional view
          mapId="disasterwatch-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="h-full w-full"
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.id}
              position={marker.position}
              title={marker.title}
            >
              <div
                style={{
                  width: `${10 + marker.magnitude * 2}px`,
                  height: `${10 + marker.magnitude * 2}px`,
                  backgroundColor: getMarkerColor(marker.magnitude), // Color based on magnitude for now
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.7)'
                }}
                aria-label={marker.title}
              >
                {/* Display magnitude for earthquakes, can adapt for other types */}
                {marker.type === 'earthquake' ? marker.magnitude.toFixed(1) : marker.type.charAt(0).toUpperCase()}
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
