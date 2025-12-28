import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number } | null;
  initialName?: string;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

function MapMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;
  return <Marker position={position} />;
}

export function LocationPicker({ onLocationSelect, initialLocation, initialName = '' }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const [locationName, setLocationName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  // Default center: Mumbai, India
  const defaultCenter: [number, number] = [19.0760, 72.8777];

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setIsLoading(true);
    
    try {
      // Reverse geocoding using free Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'RentalApp/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const name = data.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setLocationName(name);
        onLocationSelect({ name, lat, lng });
      } else {
        const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setLocationName(name);
        onLocationSelect({ name, lat, lng });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocationName(name);
      onLocationSelect({ name, lat, lng });
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleMapClick(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="btn-secondary text-sm flex items-center gap-2"
          disabled={isLoading}
        >
          <Navigation className="w-4 h-4" />
          {isLoading ? 'Getting location...' : 'Use Current Location'}
        </button>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border border-border h-[250px]">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
          <MapController center={position} />
          <MapMarker position={position} />
        </MapContainer>
        
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        )}
      </div>
      
      {locationName && (
        <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
          <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <span className="text-sm">{locationName}</span>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Click on the map to select a location, or use the quick locations above
      </p>
    </div>
  );
}
