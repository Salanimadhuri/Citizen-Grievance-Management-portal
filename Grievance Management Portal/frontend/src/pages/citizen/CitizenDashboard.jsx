import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Star } from 'lucide-react';
import { complaintAPI, feedbackAPI } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import NotificationList from '../../components/NotificationList';
import StatisticsCharts from '../../components/StatisticsCharts';
import { useNavigate } from 'react-router-dom';

const CitizenDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    pendingFeedback: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [pendingFeedbackComplaints, setPendingFeedbackComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await complaintAPI.getMy();
      const complaints = response?.data?.data || response?.data || [];
      
      const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
      const pendingFeedback = resolvedComplaints.filter(c => !c.feedbackSubmitted);
      
      setStats({
        total: complaints.length,
        inProgress: complaints.filter(c => ['In Progress', 'Assigned'].includes(c.status)).length,
        resolved: resolvedComplaints.length,
        pendingFeedback: pendingFeedback.length,
      });
      
      setAllComplaints(complaints);
      setRecentComplaints(complaints.slice(0, 3));
      setPendingFeedbackComplaints(pendingFeedback.slice(0, 2));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: FileText, color: 'bg-primary-600' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-orange-500' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-600' },
    { label: 'Pending Feedback', value: stats.pendingFeedback, icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your complaint overview.</p>
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

      {/* Charts Section */}
      {allComplaints.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
          <StatisticsCharts complaints={allComplaints} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Complaints</h2>
          <div className="grid grid-cols-1 gap-4">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <ComplaintCard key={complaint._id || complaint.id} complaint={complaint} />
              ))
            ) : (
              <div className="card text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">No complaints submitted yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <NotificationList limit={5} />
        </div>
      </div>

      {/* Pending Feedback Section */}
      {pendingFeedbackComplaints.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              <h2 className="text-xl font-semibold text-gray-900">Pending Feedback</h2>
            </div>
            <button 
              onClick={() => navigate('/citizen/feedback')}
              className="btn-secondary text-sm"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingFeedbackComplaints.map((complaint) => (
              <div key={complaint._id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{complaint.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {complaint.category} • Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate('/citizen/feedback')}
                  className="btn-primary text-sm"
                >
                  Provide Feedback
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
