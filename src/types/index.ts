
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'medical' | 'food' | 'water' | 'other';
  address: string;
  contact?: string;
  operatingHours?: string;
  notes?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
