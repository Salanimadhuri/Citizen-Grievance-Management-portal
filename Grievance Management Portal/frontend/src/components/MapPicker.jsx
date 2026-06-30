import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader } from 'lucide-react';

// Fix Leaflet default icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DEFAULT = { lat: 13.6288, lng: 79.4192 };

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [location, setLocation] = useState(initialLocation || DEFAULT);
  const [address, setAddress] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true }).setView([location.lat, location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
    marker.bindPopup('Drag or click map to move').openPopup();

    const updateLocation = async (lat, lng) => {
      setLocation({ lat, lng });
      onLocationSelect?.({ latitude: lat, longitude: lng });
      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || '');
      } catch { /* offline — skip */ }
    };

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      updateLocation(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  const useGPS = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setLocation({ lat, lng });
        onLocationSelect?.({ latitude: lat, longitude: lng });
        mapInstanceRef.current?.setView([lat, lng], 15);
        markerRef.current?.setLatLng([lat, lng]);
        setGpsLoading(false);
      },
      () => { setGpsLoading(false); alert('Could not get GPS position.'); }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label flex items-center gap-2">
          <MapPin size={16} /> Select Location
        </label>
        <button type="button" onClick={useGPS} disabled={gpsLoading}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50">
          {gpsLoading ? <Loader size={14} className="animate-spin" /> : <Navigation size={14} />}
          Use My Location
        </button>
      </div>

      <div ref={mapRef} style={{ height: '360px', width: '100%', borderRadius: '8px', zIndex: 0 }}
        className="border border-gray-300 shadow-sm" />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
          <span className="text-gray-500">Lat: </span>
          <span className="font-mono font-semibold">{location.lat.toFixed(6)}</span>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
          <span className="text-gray-500">Lng: </span>
          <span className="font-mono font-semibold">{location.lng.toFixed(6)}</span>
        </div>
      </div>

      {address && (
        <p className="text-xs text-gray-500 flex items-start gap-1">
          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
          {address}
        </p>
      )}

      <p className="text-xs text-gray-400">Click on the map or drag the marker to pinpoint the complaint location.</p>
    </div>
  );
};

export default MapPicker;
