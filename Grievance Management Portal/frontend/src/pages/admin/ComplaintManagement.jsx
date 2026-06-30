import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Eye, UserCog, Edit, Search } from 'lucide-react';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchTerm, filterStatus, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching complaints for admin...');
      const response = await complaintAPI.getAll();
      const complaintsData = response?.data?.data || response?.data || [];
      console.log('Complaints data:', complaintsData);
      
      setComplaints(complaintsData);
      setFilteredComplaints(complaintsData);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints || [];

    if (searchTerm && filtered.length > 0) {
      filtered = filtered.filter(c =>
        c?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus && filtered.length > 0) {
      filtered = filtered.filter(c => c?.status === filterStatus);
    }

    setFilteredComplaints(filtered);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div></div>;
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchComplaints} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600">View and manage all complaints in the system</p>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Citizen</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints && filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <tr key={complaint?.id || complaint?._id || Math.random()} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">#{(complaint?.id || complaint?._id || '').slice(-6)}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {complaint?.escalated && (
                        <span className="text-red-500 font-bold" title="Escalated">🔴</span>
                      )}
                      {complaint?.duplicateOf && (
                        <span className="text-blue-500 font-bold" title="Duplicate">📋</span>
                      )}
                      {complaint?.userId?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{complaint?.title || 'Untitled'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{complaint?.category || 'General'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {complaint?.escalated && (
                        <span className="w-2 h-2 bg-red-500 rounded-full" title="Escalated"></span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        (complaint?.priorityScore || 0) >= 70 ? 'bg-red-100 text-red-700' :
                        (complaint?.priorityScore || 0) >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {complaint?.priorityScore > 0 ? `🧠 ${complaint.priorityScore}` : complaint?.priorityScore || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={complaint?.status || 'Submitted'} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{complaint?.departmentId?.name || 'Unassigned'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/complaints/${complaint?.id || complaint?._id}`)}
                        className="text-primary-700 hover:text-primary-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/update-status/${complaint?.id || complaint?._id}`)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Update Status"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/assign?complaintId=${complaint?.id || complaint?._id}`)}
                        className="text-green-600 hover:text-green-700"
                        title="Assign"
                      >
                        <UserCog size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-600">No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {filteredComplaints && filteredComplaints.length === 0 && !error && (
          <div className="text-center py-12 text-gray-600">No complaints found</div>
        )}
      </div>
    </div>
  );
};

export default ComplaintManagement;
