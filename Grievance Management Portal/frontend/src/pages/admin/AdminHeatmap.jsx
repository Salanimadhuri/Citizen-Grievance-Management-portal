import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { complaintAPI } from '../../services/api';
import { Filter, MapPin, Layers } from 'lucide-react';

const CATEGORIES = ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Waste Management', 'Public Safety', 'Other'];
const STATUSES   = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

const PRIORITY_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#3b82f6', default: '#6b7280' };

const AdminHeatmap = () => {
  const mapRef      = useRef(null);
  const mapInst     = useRef(null);
  const heatRef     = useRef(null);
  const clusterRef  = useRef(null);
  const [filters, setFilters]   = useState({ category: '', status: '' });
  const [mode, setMode]         = useState('heat');   // 'heat' | 'cluster'
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [stats, setStats]       = useState({ total: 0, high: 0, locations: 0 });

  // Init map once
  useEffect(() => {
    if (mapInst.current) return;
    const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 19,
    }).addTo(map);
    mapInst.current = map;
    return () => { mapInst.current?.remove(); mapInst.current = null; };
  }, []);

  // Load data whenever filters change
  useEffect(() => { fetchData(); }, [filters]);

  // Switch between heat/cluster on mode change
  useEffect(() => { if (complaints.length) renderLayer(complaints); }, [mode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getLocations(filters);
      const raw = res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : [];
      setComplaints(list);
      const withGeo = list.filter(c => c.location?.latitude && c.location?.longitude);
      setStats({
        total: list.length,
        high: list.filter(c => c.aiPriority === 'High' || c.priorityScore >= 70).length,
        locations: withGeo.length,
      });
      renderLayer(list);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const clearLayers = () => {
    if (heatRef.current)    { mapInst.current?.removeLayer(heatRef.current);    heatRef.current = null; }
    if (clusterRef.current) { mapInst.current?.removeLayer(clusterRef.current); clusterRef.current = null; }
  };

  const renderLayer = (list) => {
    if (!mapInst.current) return;
    clearLayers();
    const geoComplaints = list.filter(c => c.location?.latitude && c.location?.longitude);
    if (!geoComplaints.length) return;

    if (mode === 'heat') {
      const points = geoComplaints.map(c => {
        const intensity = c.aiPriority === 'High' ? 1.0 : c.aiPriority === 'Medium' ? 0.6 : 0.3;
        return [c.location.latitude, c.location.longitude, intensity];
      });
      heatRef.current = L.heatLayer(points, {
        radius: 30, blur: 20, maxZoom: 17,
        gradient: { 0.0: '#3b82f6', 0.4: '#06b6d4', 0.6: '#fbbf24', 0.85: '#f97316', 1.0: '#ef4444' },
      }).addTo(mapInst.current);
    } else {
      const cluster = L.markerClusterGroup({ chunkedLoading: true });
      geoComplaints.forEach(c => {
        const color = PRIORITY_COLOR[c.aiPriority] || PRIORITY_COLOR.default;
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
          iconSize: [14, 14],
        });
        const marker = L.marker([c.location.latitude, c.location.longitude], { icon });
        marker.bindPopup(`
          <div style="min-width:180px">
            <strong>${c.title || 'Complaint'}</strong><br/>
            <span style="color:#6b7280;font-size:12px">${c.category || ''}</span><br/>
            ${c.aiPriority ? `<span style="color:${color};font-weight:600;font-size:12px">Priority: ${c.aiPriority}</span><br/>` : ''}
            <span style="font-size:12px">Status: ${c.status || ''}</span>
          </div>`);
        cluster.addLayer(marker);
      });
      clusterRef.current = cluster;
      mapInst.current.addLayer(cluster);
    }

    // Fit map to data bounds
    const bounds = L.latLngBounds(geoComplaints.map(c => [c.location.latitude, c.location.longitude]));
    if (bounds.isValid()) mapInst.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Heatmap</h1>
        <p className="text-gray-500 text-sm">Geospatial analysis of complaint density across the city</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Complaints', value: stats.total, color: 'blue' },
          { label: 'High Priority', value: stats.high, color: 'red' },
          { label: 'Geotagged', value: stats.locations, color: 'green' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-600`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Layers size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">View:</span>
            <button onClick={() => setMode('heat')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'heat' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Heatmap
            </button>
            <button onClick={() => setMode('cluster')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'cluster' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Clusters
            </button>
          </div>
          {loading && <span className="text-sm text-gray-500 animate-pulse">Loading...</span>}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div ref={mapRef} style={{ height: '520px', width: '100%', zIndex: 0 }} />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          {mode === 'heat' ? 'Heat Intensity' : 'Priority Markers'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {mode === 'heat' ? (
            <div className="flex items-center gap-6">
              {[['#3b82f6','Low'],['#fbbf24','Medium'],['#ef4444','High']].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span style={{ background: c }} className="w-4 h-3 rounded inline-block" />
                  {l}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {Object.entries(PRIORITY_COLOR).filter(([k]) => k !== 'default').map(([k, c]) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span style={{ background: c }} className="w-3 h-3 rounded-full inline-block" />
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeatmap;
