
import type { DisasterEvent, Resource } from '@/types';

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

export const mockResources: Resource[] = [
  {
    id: 'res-001',
    name: 'City Central Shelter',
    type: 'shelter',
    address: '123 Main St, Yangon, Myanmar',
    contact: '09-123-4567',
    operatingHours: '24/7 during emergencies',
    notes: 'Pets allowed in carriers. Food and water provided.',
    coordinates: { latitude: 16.8000, longitude: 96.1500 },
  },
  {
    id: 'res-002',
    name: 'General Hospital - ER',
    type: 'medical',
    address: '456 Health Ave, Yangon, Myanmar',
    contact: '192 (Emergency)',
    operatingHours: '24/7',
    notes: 'Prioritizing critical injuries.',
    coordinates: { latitude: 16.8100, longitude: 96.1600 },
  },
  {
    id: 'res-003',
    name: 'Community Food Bank',
    type: 'food',
    address: '789 Charity Rd, Mandalay, Myanmar',
    operatingHours: '9 AM - 5 PM (Emergency hours may vary)',
    notes: 'Non-perishable food items available. Bring ID if possible.',
  },
  {
    id: 'res-004',
    name: 'Downtown Water Point',
    type: 'water',
    address: 'Plaza Park, Yangon, Myanmar',
    operatingHours: 'Activated during emergencies',
    notes: 'Clean drinking water distribution.',
  },
  {
    id: 'res-005',
    name: 'Red Cross First Aid Station - North',
    type: 'medical',
    address: 'North Suburb Community Hall, Yangon',
    operatingHours: '10 AM - 6 PM (Emergency hours may vary)',
    notes: 'Basic first aid and medical advice.',
  },
  {
    id: 'res-006',
    name: 'Westside Animal Shelter (Temporary for Disasters)',
    type: 'shelter',
    address: 'Old Warehouse, West Industrial Park, Yangon',
    contact: '09-987-6543',
    operatingHours: '24/7 during emergencies',
    notes: 'For displaced pets. Please bring any supplies you have for your animal.',
  }
];
