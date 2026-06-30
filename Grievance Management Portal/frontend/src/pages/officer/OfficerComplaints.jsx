import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import { ClipboardList, Eye, Edit, Filter } from 'lucide-react';

const OfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const activeFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [activeFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await complaintAPI.getOfficerComplaints();
      const complaintsData = response?.data?.data || response?.data || [];
      
      setComplaints(complaintsData);
      setFilteredComplaints(complaintsData);
    } catch (error) {
      console.error('Officer complaints fetch error:', error);
      setError('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;
    
    switch (activeFilter) {
      case 'assigned':
        filtered = complaints.filter(c => c?.status === 'Assigned');
        break;
      case 'inprogress':
        filtered = complaints.filter(c => ['Work Scheduled', 'In Progress', 'Under Review'].includes(c?.status));
        break;
      case 'resolved':
        filtered = complaints.filter(c => c?.status === 'Resolved');
        break;
      default:
        filtered = complaints;
    }
    
    setFilteredComplaints(filtered);
  };

  const getFilterCounts = () => {
    return {
      all: complaints.length,
      assigned: complaints.filter(c => c?.status === 'Assigned').length,
      inprogress: complaints.filter(c => ['Work Scheduled', 'In Progress', 'Under Review'].includes(c?.status)).length,
      resolved: complaints.filter(c => c?.status === 'Resolved').length
    };
  };

  const counts = getFilterCounts();

  const handleFilterChange = (filterKey) => {
    setSearchParams({ filter: filterKey });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchComplaints} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Complaints</h1>
        <p className="text-gray-600">View and manage complaints assigned to you</p>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-400" />
          <span className="font-medium text-gray-700">Filter by Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Complaints', count: counts.all },
            { key: 'assigned', label: 'Assigned', count: counts.assigned },
            { key: 'inprogress', label: 'In Progress', count: counts.inprogress },
            { key: 'resolved', label: 'Resolved', count: counts.resolved }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {filteredComplaints && filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id || complaint._id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{complaint.title || 'Untitled'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      complaint.status === 'Work Scheduled' ? 'bg-yellow-100 text-yellow-700' :
                      complaint.status === 'Under Review' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status || 'Assigned'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{complaint.description || 'No description'}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Category: {complaint.category || 'General'}</span>
                    <span>Citizen: {complaint.userId?.name || 'Unknown'}</span>
                    <span>Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/officer/complaints/${complaint.id || complaint._id}`)}
                  className="btn-secondary flex items-center gap-1 flex-1"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/officer/manage/${complaint.id || complaint._id}`)}
                  className="btn-primary flex items-center gap-1 flex-1"
                >
                  <Edit size={16} />
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <ClipboardList className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">
            {activeFilter === 'all' ? 'No complaints assigned yet' : `No ${activeFilter} complaints`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OfficerComplaints;
