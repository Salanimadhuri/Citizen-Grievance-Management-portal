import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1976D2', '#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#F44336'];

const StatCard = ({ label, value, bg, text }) => (
  <div className={`${bg} rounded-lg p-4`}>
    <p className={`text-sm ${text} mb-1`}>{label}</p>
    <p className={`text-2xl font-bold ${text.replace('700', '900')}`}>{value}</p>
  </div>
);

const Analytics = () => {
  const [data, setData] = useState({
    byCategory: [], byStatus: [], resolutionRate: [],
    departmentPerformance: [], monthlyTrends: [], stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/analytics');
      const d = res.data || {};
      setData({
        byCategory:            Array.isArray(d.byCategory)           ? d.byCategory           : [],
        byStatus:              Array.isArray(d.byStatus)             ? d.byStatus             : [],
        resolutionRate:        Array.isArray(d.resolutionRate)       ? d.resolutionRate       : [],
        departmentPerformance: Array.isArray(d.departmentPerformance)? d.departmentPerformance: [],
        monthlyTrends:         Array.isArray(d.monthlyTrends)        ? d.monthlyTrends        : [],
        stats:                 d.stats || {},
      });
    } catch (err) {
      setError('Failed to load analytics. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Compute key metrics from live stats
  const { total = 0, resolved = 0, pending = 0, inProgress = 0 } = data.stats;
  const resolutionPct = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const activeCases   = pending + inProgress;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 text-sm">
          <span>{error}</span>
          <button onClick={fetchAnalytics} className="underline font-medium">Retry</button>
        </div>
      )}

      {/* Key Metrics — live data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Complaints"  value={total}              bg="bg-blue-50"   text="text-blue-700" />
        <StatCard label="Resolution Rate"   value={`${resolutionPct}%`} bg="bg-green-50"  text="text-green-700" />
        <StatCard label="Active Cases"      value={activeCases}        bg="bg-orange-50" text="text-orange-700" />
        <StatCard label="Resolved"          value={resolved}           bg="bg-purple-50" text="text-purple-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Complaints by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h3>
          {data.byCategory.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.byCategory} cx="50%" cy="50%" outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value">
                  {data.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Resolution Rate */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
          {data.resolutionRate.length === 0 ? (
            <div className="flex items-center justify-center h-64 flex-col gap-3">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4CAF50" strokeWidth="3"
                    strokeDasharray={`${resolutionPct} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
                  {resolutionPct}%
                </span>
              </div>
              <p className="text-sm text-gray-500">{resolved} of {total} complaints resolved</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.resolutionRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#4CAF50" name="Resolved" />
                <Bar dataKey="pending"  fill="#FF9800" name="Pending"  />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Department Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          {data.departmentPerformance.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">No department data yet — assign complaints to departments to see performance metrics</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.departmentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="avgResolutionTime" fill="#1976D2" name="Avg Resolution (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Complaint Trends</h3>
          {data.monthlyTrends.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">No monthly trend data yet — trends appear after complaints span multiple months</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#1976D2" strokeWidth={2} name="Complaints" />
                <Line type="monotone" dataKey="resolved"   stroke="#4CAF50" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Status Breakdown */}
      {data.byStatus.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2196F3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

export default Analytics;
