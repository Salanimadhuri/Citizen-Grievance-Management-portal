import { useEffect, useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [chartData, setChartData] = useState({
    byCategory: [],
    byStatus: [],
    resolutionRate: [],
    departmentPerformance: [],
    monthlyTrends: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getChartData();
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const COLORS = ['#1976D2', '#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#F44336'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.byCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.resolutionRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" fill="#4CAF50" name="Resolved" />
              <Bar dataKey="pending" fill="#FF9800" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.departmentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="avgResolutionTime" fill="#1976D2" name="Avg Resolution Time (hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Complaint Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#1976D2" strokeWidth={2} name="Complaints" />
              <Line type="monotone" dataKey="resolved" stroke="#4CAF50" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-sm text-primary-700 mb-1">Avg Resolution Time</p>
            <p className="text-2xl font-bold text-primary-900">48 hrs</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Resolution Rate</p>
            <p className="text-2xl font-bold text-green-900">87%</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-700 mb-1">Citizen Satisfaction</p>
            <p className="text-2xl font-bold text-orange-900">4.2/5</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 mb-1">Active Officers</p>
            <p className="text-2xl font-bold text-purple-900">24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
