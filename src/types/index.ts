
export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number; // Unix timestamp
  coordinates: {
    longitude: number;
    latitude: number;
  };
  depth: number; // in km
}
