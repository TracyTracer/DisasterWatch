
export interface DisasterEvent {
  id: string;
  type: string; // e.g., "earthquake", "flood", "cyclone"
  magnitude: number; // For earthquakes, can be adapted for other severity measures
  place: string;
  time: number; // Unix timestamp
  coordinates: {
    longitude: number;
    latitude: number;
  };
  depth: number; // in km, specific to earthquakes, might be N/A for others
}
