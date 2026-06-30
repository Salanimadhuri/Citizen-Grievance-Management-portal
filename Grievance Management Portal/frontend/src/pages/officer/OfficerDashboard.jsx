import { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { complaintAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatisticsCharts from '../../components/StatisticsCharts';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolvedToday: 0,
    pending: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await complaintAPI.getOfficerComplaints();
      const complaints = response?.data?.data || response?.data || [];
      
      const today = new Date().toDateString();
      const safeComplaints = Array.isArray(complaints) ? complaints : [];
      
      setStats({
        assigned: safeComplaints.filter(c => c?.status === 'Assigned').length,
        inProgress: safeComplaints.filter(c => ['Work Scheduled', 'In Progress'].includes(c?.status)).length,
        resolvedToday: safeComplaints.filter(c => 
          c?.status === 'Resolved' && 
          c?.resolvedAt && 
          new Date(c.resolvedAt).toDateString() === today
        ).length,
        pending: safeComplaints.filter(c => ['Assigned', 'Under Review'].includes(c?.status)).length
      });
      
      setAllComplaints(safeComplaints);
      setRecentComplaints(safeComplaints.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaints = () => {
    navigate('/officer/complaints');
  };

  const statCards = [
    { label: 'Pending Action', value: stats.pending, icon: AlertTriangle, color: 'bg-orange-500', textColor: 'text-orange-600' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { label: 'Assigned to Me', value: stats.assigned, icon: ClipboardList, color: 'bg-primary-600', textColor: 'text-primary-600' },
    { label: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle, color: 'bg-green-600', textColor: 'text-green-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Officer'}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-primary-600 font-medium mt-1">Officer Dashboard</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewComplaints}>
              <div className="flex flex-col items-center text-center">
                <div className={`${stat.color} p-3 rounded-lg mb-3`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      {allComplaints.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
          <StatisticsCharts complaints={allComplaints} />
        </div>
      )}

      {/* Recent Assignments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
          <button onClick={handleViewComplaints} className="btn-secondary text-sm">
            View All
          </button>
        </div>
        <div className="card">
          <div className="space-y-3">
            {recentComplaints && recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <div 
                  key={complaint._id || complaint.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all group"
                  onClick={() => navigate(`/officer/manage/${complaint.id || complaint._id}`)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{complaint?.title || 'Untitled'}</h4>
                      <p className="text-sm text-gray-600 mt-1">Category: {complaint?.category || 'General'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      complaint?.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      complaint?.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      complaint?.status === 'Work Scheduled' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint?.status || 'Assigned'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ClipboardList className="mx-auto mb-3 text-gray-400" size={40} />
                <p className="font-medium">No complaints assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
