import type { DisasterEvent } from '@/types';

export const mockRecentDisasterEvents: DisasterEvent[] = [
  {
    id: '1',
    type: 'earthquake',
    magnitude: 5.8,
    place: '10km N of San Francisco, CA',
    time: Date.now() - 3600 * 1000 * 2, // 2 hours ago
    coordinates: { longitude: -122.4194, latitude: 37.7749 },
    depth: 10.5,
  },
  {
    id: '2',
    type: 'earthquake',
    magnitude: 4.2,
    place: '5km SE of Los Angeles, CA',
    time: Date.now() - 3600 * 1000 * 5, // 5 hours ago
    coordinates: { longitude: -118.2437, latitude: 34.0522 },
    depth: 15.2,
  },
  {
    id: '3',
    type: 'earthquake',
    magnitude: 6.1,
    place: 'Near Yangon, Myanmar',
    time: Date.now() - 3600 * 1000 * 8, // 8 hours ago
    coordinates: { longitude: 96.1735, latitude: 16.8409 },
    depth: 25.0,
  },
  {
    id: '4',
    type: 'earthquake',
    magnitude: 5.5,
    place: 'Off the coast of Sumatra, Indonesia',
    time: Date.now() - 3600 * 1000 * 10, // 10 hours ago
    coordinates: { longitude: 95.3238, latitude: 3.5952 },
    depth: 20.0,
  },
  {
    id: '5',
    type: 'earthquake',
    magnitude: 3.5,
    place: 'Near Mandalay, Myanmar',
    time: Date.now() - 3600 * 1000 * 12, // 12 hours ago
    coordinates: { longitude: 96.0891, latitude: 21.9588 },
    depth: 5.1,
  },
];

export const mockDisasterMarkers = mockRecentDisasterEvents.map(event => ({
  id: event.id,
  position: { lat: event.coordinates.latitude, lng: event.coordinates.longitude },
  title: `M ${event.magnitude} - ${event.place} (${event.type})`,
  magnitude: event.magnitude, // Still used for earthquake marker sizing/color
  type: event.type,
}));
