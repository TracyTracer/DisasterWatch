import type { Earthquake } from '@/types';

export const mockRecentEarthquakes: Earthquake[] = [
  {
    id: '1',
    magnitude: 5.8,
    place: '10km N of San Francisco, CA',
    time: Date.now() - 3600 * 1000 * 2, // 2 hours ago
    coordinates: { longitude: -122.4194, latitude: 37.7749 },
    depth: 10.5,
  },
  {
    id: '2',
    magnitude: 4.2,
    place: '5km SE of Los Angeles, CA',
    time: Date.now() - 3600 * 1000 * 5, // 5 hours ago
    coordinates: { longitude: -118.2437, latitude: 34.0522 },
    depth: 15.2,
  },
  {
    id: '3',
    magnitude: 6.1,
    place: '25km W of Anchorage, AK',
    time: Date.now() - 3600 * 1000 * 10, // 10 hours ago
    coordinates: { longitude: -149.9003, latitude: 61.2181 },
    depth: 20.0,
  },
  {
    id: '4',
    magnitude: 3.5,
    place: 'Near The Geysers, CA',
    time: Date.now() - 3600 * 1000 * 12, // 12 hours ago
    coordinates: { longitude: -122.7558, latitude: 38.7755 },
    depth: 5.1,
  },
];

export const mockMapMarkers = mockRecentEarthquakes.map(eq => ({
  id: eq.id,
  position: { lat: eq.coordinates.latitude, lng: eq.coordinates.longitude },
  title: `M ${eq.magnitude} - ${eq.place}`,
  magnitude: eq.magnitude,
}));
