import { useEffect, useState, useRef } from 'react';
import { complaintAPI } from '../../services/api';
import { MapPin, Filter, Calendar, Tag } from 'lucide-react';

const AdminHeatmap = () => {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState(null);

  const categories = ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Waste Management', 'Public Safety', 'Other'];
  const statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  useEffect(() => {
    initializeMap();
    loadHeatmapData();
  }, []);

  useEffect(() => {
    loadHeatmapData();
  }, [filters]);

  const initializeMap = () => {
    if (typeof window !== 'undefined' && window.L && !mapRef.current) {
      const map = window.L.map('admin-heatmap').setView([13.0827, 80.2707], 11);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
    }
  };

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await complaintAPI.getLocations(params);
      const data = response.data;
      
      // Handle AI-enhanced response format
      let heatmapData;
      if (data.heatmapData) {
        heatmapData = data.heatmapData;
        setTrends(data.trends);
      } else {
        heatmapData = data;
        setTrends(null);
      }

      if (mapRef.current && window.L) {
        // Remove existing heat layer
        if (heatLayerRef.current) {
          mapRef.current.removeLayer(heatLayerRef.current);
        }

        // Add new heat layer with AI-enhanced intensity
        if (heatmapData.length > 0) {
          heatLayerRef.current = window.L.heatLayer(heatmapData, {
            radius: 25,
            blur: 20,
            maxZoom: 17,
            gradient: {
              0.0: 'blue',
              0.3: 'cyan',
              0.5: 'lime',
              0.7: 'yellow',
              1.0: 'red'
            }
          }).addTo(mapRef.current);
        }
      }
    } catch (error) {
      console.error('Error loading heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Heatmap</h1>
        <p className="text-gray-600">Visual analysis of complaint density and priority across the city</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={clearFilters} className="btn-secondary">
            Clear Filters
          </button>
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Heat Intensity Legend</h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High Priority / Escalated</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card">
        <div id="admin-heatmap" className="h-96 rounded-lg border border-gray-300"></div>
      </div>

      {/* AI Trends Analytics */}
      {trends && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emerging Hotspots */}
          {trends.emergingHotspots && trends.emergingHotspots.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🔥 Emerging Hotspots
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                  {trends.emergingHotspots.length}
                </span>
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {trends.emergingHotspots.map((hotspot, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">Area {index + 1}</h4>
                      <span className="text-sm text-orange-600 font-semibold">
                        {hotspot.recentComplaints} recent
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Total: {hotspot.totalComplaints} complaints
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hotspot.categories.map((cat, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Trends */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Category Distribution</h3>
            <div className="space-y-2">
              {Object.entries(trends.categoryTrends || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{category}</span>
                  <span className="font-semibold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeatmap;