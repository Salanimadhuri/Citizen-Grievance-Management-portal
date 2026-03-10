import { useEffect, useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { MapPin, Filter } from 'lucide-react';

const HeatmapView = () => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [heatmapData, setHeatmapData] = useState([]);

  const categories = ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Waste Management', 'Public Safety', 'Other'];
  const statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchHeatmapData();
  }, [filters]);

  const fetchHeatmapData = async () => {
    try {
      const response = await analyticsAPI.getHeatmapData(filters);
      setHeatmapData(response.data);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Heatmap</h1>
        <p className="text-gray-600">Visualize complaint density across locations</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center border border-gray-300">
          <div className="text-center text-gray-500">
            <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Google Maps Heatmap</p>
            <p className="text-sm">Complaint density visualization</p>
            <p className="text-xs mt-2 text-gray-400">
              {heatmapData.length} complaints plotted
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Hotspot Locations</h3>
        <div className="space-y-3">
          {[
            { location: 'MG Road, Sector 14', count: 45, severity: 'high' },
            { location: 'Park Street, Sector 22', count: 32, severity: 'medium' },
            { location: 'Lake View Area', count: 28, severity: 'medium' },
            { location: 'Industrial Zone B', count: 19, severity: 'low' },
          ].map((hotspot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{hotspot.location}</p>
                  <p className="text-sm text-gray-600">{hotspot.count} complaints</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                hotspot.severity === 'high' ? 'bg-red-100 text-red-700' :
                hotspot.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {hotspot.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
