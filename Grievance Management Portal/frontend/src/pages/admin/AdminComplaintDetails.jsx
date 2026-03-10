import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { MapPin, Calendar, Tag, ArrowLeft, CheckCircle, User, Phone, Mail } from 'lucide-react';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Admin fetching complaint details for ID:', id);
      const response = await complaintAPI.getById(id);
      console.log('Admin complaint details received:', response.data);
      setComplaint(response.data);
    } catch (error) {
      console.error('Admin complaint fetch error:', error);
      setError(error.response?.data?.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    { status: 'Submitted', date: complaint?.createdAt, active: true },
    { status: 'Under Review', date: complaint?.reviewedAt, active: ['Under Review', 'Assigned', 'In Progress', 'Resolved'].includes(complaint?.status) },
    { status: 'Assigned', date: complaint?.assignedAt, active: ['Assigned', 'In Progress', 'Resolved'].includes(complaint?.status) },
    { status: 'In Progress', date: complaint?.inProgressAt, active: ['In Progress', 'Resolved'].includes(complaint?.status) },
    { status: 'Resolved', date: complaint?.resolvedAt, active: complaint?.status === 'Resolved' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/admin/complaints')} className="btn-secondary">
          Back to Complaints
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Complaint not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/admin/complaints')} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Back to Complaints
      </button>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title || 'Untitled Complaint'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Tag size={16} />
                {complaint.category || 'General'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <StatusBadge status={complaint.status || 'Submitted'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{complaint.description || 'No description provided'}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Citizen Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{complaint.userId?.name || 'Unknown Citizen'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{complaint.userId?.email || 'N/A'}</span>
                </div>
                {complaint.userId?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{complaint.userId.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Assignment</h3>
              <div className="space-y-2">
                <p><strong>Department:</strong> {complaint.departmentId?.name || 'Unassigned'}</p>
                <p><strong>Assigned Officer:</strong> {complaint.assignedOfficer?.name || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <MapPin size={18} />
                <span>
                  {complaint.location?.latitude && complaint.location?.longitude
                    ? `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`
                    : 'Location not specified'}
                </span>
              </div>
            </div>

            {complaint.images && complaint.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Evidence</h3>
                <div className="grid grid-cols-2 gap-3">
                  {complaint.images.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`Evidence ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg border border-gray-200" 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-6">Status Timeline</h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.active ? 'bg-primary-500' : 'bg-gray-300'
              }`}>
                {item.active && <CheckCircle size={18} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                  {item.status}
                </p>
                {item.date && (
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/admin/assign?complaintId=${complaint._id}`)}
          className="btn-primary"
        >
          Assign Complaint
        </button>
        <button
          onClick={() => navigate('/admin/complaints')}
          className="btn-secondary"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default AdminComplaintDetails;