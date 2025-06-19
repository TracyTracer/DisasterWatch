"use client";

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Earthquake } from '@/types';
import { mockMapMarkers } from '@/lib/mock-data'; // Using mock data
import { useEffect, useState } from 'react';

interface EarthquakeMapProps {
  earthquakes?: Earthquake[]; // Optional prop for dynamic data in future
}

// Helper to determine marker color based on magnitude
const getMarkerColor = (magnitude: number) => {
  if (magnitude < 4) return '#4CAF50'; // Green
  if (magnitude < 6) return '#FFC107'; // Amber
  return '#F44336'; // Red
};

export function EarthquakeMap({ earthquakes }: EarthquakeMapProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Default to US center
  const markers = earthquakes ? earthquakes.map(eq => ({
    id: eq.id,
    position: { lat: eq.coordinates.latitude, lng: eq.coordinates.longitude },
    title: `M ${eq.magnitude} - ${eq.place}`,
    magnitude: eq.magnitude,
  })) : mockMapMarkers;

  useEffect(() => {
    // This is a placeholder for fetching API key if it were client-side dynamic
    // For this project, we assume NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in .env
    const envApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
    } else {
      console.warn("Google Maps API Key is not set. Map functionality will be limited.");
    }

    if (markers.length > 0) {
      setMapCenter(markers[0].position);
    }
  }, [markers]);


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
          defaultCenter={mapCenter}
          defaultZoom={4}
          mapId="quakechat-map"
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
                  backgroundColor: getMarkerColor(marker.magnitude),
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
                {marker.magnitude.toFixed(1)}
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
