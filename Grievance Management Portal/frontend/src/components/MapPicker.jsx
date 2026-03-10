import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 13.6288, lng: 79.4192 }
  );
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([selectedLocation.lat, selectedLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      draggable: true
    }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Handle map click
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const newLocation = { lat, lng };
      
      marker.setLatLng([lat, lng]);
      setSelectedLocation(newLocation);
      if (onLocationSelect) {
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    });

    // Handle marker drag
    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      const newLocation = { lat, lng };
      
      setSelectedLocation(newLocation);
      if (onLocationSelect) {
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newLocation = { lat, lng };
          
          setSelectedLocation(newLocation);
          if (onLocationSelect) {
            onLocationSelect({ latitude: lat, longitude: lng });
          }

          // Update map and marker
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 13);
            markerRef.current.setLatLng([lat, lng]);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please click on the map to select a location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label flex items-center gap-2">
          <MapPin size={18} />
          Select Location on Map
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Navigation size={16} />
          Use Current Location
        </button>
      </div>

      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        className="border border-gray-300"
      />

      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Selected Coordinates:</p>
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-gray-900">
            Latitude: {selectedLocation.lat.toFixed(6)}
          </span>
          <span className="font-medium text-gray-900">
            Longitude: {selectedLocation.lng.toFixed(6)}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        💡 Click anywhere on the map or drag the marker to select the complaint location
      </p>
    </div>
  );
};

export default MapPicker;
