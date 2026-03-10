import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Eye, Search } from 'lucide-react';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchTerm, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching officer complaints...');
      const response = await complaintAPI.getOfficerComplaints();
      const complaintsData = response?.data || [];
      
      console.log('Officer complaints received:', complaintsData.length);
      setComplaints(complaintsData);
      setFilteredComplaints(complaintsData);
    } catch (error) {
      console.error('Officer complaints fetch error:', error);
      setError(error.response?.data?.message || 'Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    if (searchTerm && complaints.length > 0) {
      const filtered = complaints.filter(c =>
        c?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComplaints(filtered);
    } else {
      setFilteredComplaints(complaints);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
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
        <h1 className="text-2xl font-bold text-gray-900">Assigned Complaints</h1>
        <p className="text-gray-600">View and manage complaints assigned to you</p>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-600">#{complaint._id.slice(-6)}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{complaint.title}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{complaint.category}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{complaint.location?.address || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    complaint.priorityScore === 'High' ? 'bg-red-100 text-red-700' :
                    complaint.priorityScore === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {complaint.priorityScore || 'Medium'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => navigate(`/officer/update/${complaint._id}`)}
                    className="text-primary-700 hover:text-primary-800 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 text-gray-600">No complaints found</div>
        )}
      </div>
    </div>
  );
};

export default AssignedComplaints;
