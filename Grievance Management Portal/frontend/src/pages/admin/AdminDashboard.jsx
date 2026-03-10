import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { complaintAPI } from '../../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [chartData, setChartData] = useState({
    byCategory: [],
    byStatus: [],
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin dashboard data...');
      
      // Fetch all complaints directly
      const complaintsResponse = await complaintAPI.getAll();
      console.log('Fetched complaints:', complaintsResponse.data);
      const complaints = complaintsResponse.data;
      setRecentComplaints(complaints.slice(0, 5)); // Show latest 5
      
      // Calculate stats from complaints
      const totalComplaints = complaints.length;
      const pending = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
      const inProgress = complaints.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length;
      const resolved = complaints.filter(c => c.status === 'Resolved').length;
      
      console.log('Calculated stats:', { totalComplaints, pending, inProgress, resolved });
      setStats({ total: totalComplaints, pending, inProgress, resolved });
      
      // Calculate chart data from complaints
      const categoryData = {};
      const statusData = {};
      
      complaints.forEach(complaint => {
        // Category data
        categoryData[complaint.category] = (categoryData[complaint.category] || 0) + 1;
        // Status data
        statusData[complaint.status] = (statusData[complaint.status] || 0) + 1;
      });
      
      const byCategory = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
      const byStatus = Object.entries(statusData).map(([name, value]) => ({ name, value }));
      
      setChartData({ byCategory, byStatus });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: FileText, color: 'bg-primary-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
    { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-600' },
  ];

  const COLORS = ['#1976D2', '#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#F44336'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of all complaints and system analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
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
                outerRadius={80}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recentComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Citizen</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Title</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr key={complaint._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm text-gray-600">#{complaint._id.slice(-6)}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{complaint.userId?.name || 'N/A'}</td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-900">{complaint.title}</td>
                    <td className="py-2 px-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
                        className="text-primary-600 hover:text-primary-700"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
