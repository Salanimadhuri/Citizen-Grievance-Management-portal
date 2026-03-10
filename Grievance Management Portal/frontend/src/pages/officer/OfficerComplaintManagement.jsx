import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { MapPin, Calendar, Tag, ArrowLeft, CheckCircle, User, Phone, Mail, Edit, Save } from 'lucide-react';

const OfficerComplaintManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const statusOptions = ['Under Review', 'Work Scheduled', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  useEffect(() => {
    if (complaint?.location?.latitude && complaint?.location?.longitude && !mapRef.current) {
      initializeMap();
    }
  }, [complaint]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await complaintAPI.getOfficerById(id);
      setComplaint(response.data);
      setStatus(response.data.status || 'Assigned');
    } catch (error) {
      console.error('Error fetching complaint:', error);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (typeof window !== 'undefined' && window.L && complaint?.location?.latitude) {
      const map = window.L.map('complaint-map').setView([
        complaint.location.latitude, 
        complaint.location.longitude
      ], 15);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      window.L.marker([complaint.location.latitude, complaint.location.longitude])
        .addTo(map)
        .bindPopup(complaint.title || 'Complaint Location');

      mapRef.current = map;
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await complaintAPI.update(id, { status, remarks });
      setSuccess('Status updated successfully!');
      await fetchComplaintDetails(); // Refresh data
      setRemarks(''); // Clear remarks after update
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const timeline = [
    { status: 'Submitted', date: complaint?.createdAt, active: true },
    { status: 'Under Review', date: complaint?.reviewedAt, active: ['Under Review', 'Work Scheduled', 'In Progress', 'Resolved'].includes(complaint?.status) },
    { status: 'Assigned', date: complaint?.assignedAt, active: ['Assigned', 'Work Scheduled', 'In Progress', 'Resolved'].includes(complaint?.status) },
    { status: 'Work Scheduled', date: complaint?.scheduledAt, active: ['Work Scheduled', 'In Progress', 'Resolved'].includes(complaint?.status) },
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

  if (error && !complaint) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/officer/complaints')} className="btn-secondary">
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
    <div className="max-w-6xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/officer/complaints')} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Back to My Complaints
      </button>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Information */}
        <div className="lg:col-span-2 space-y-6">
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
              <StatusBadge status={complaint.status || 'Assigned'} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{complaint.description || 'No description provided'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Citizen Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
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
            </div>
          </div>

          {/* Location Map */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <MapPin size={18} />
              <span>
                {complaint.location?.latitude && complaint.location?.longitude
                  ? `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`
                  : 'Location not specified'}
              </span>
            </div>
            {complaint.location?.latitude && complaint.location?.longitude ? (
              <div id="complaint-map" className="h-64 rounded-lg border border-gray-300"></div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border border-gray-300">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No location data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Evidence Viewer */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Evidence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complaint.images.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Evidence ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                    onClick={() => window.open(img, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Update Panel */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Edit size={18} />
              Update Status
            </h3>
            
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="Assigned">Assigned</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Add Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Add progress updates, notes, or remarks..."
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={updating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setStatus('Resolved');
                    setRemarks('Complaint has been resolved successfully.');
                  }}
                  className="btn-success flex-1 text-sm"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Progress Timeline</h3>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.active ? 'bg-primary-500' : 'bg-gray-300'
                  }`}>
                    {item.active && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.status}
                    </p>
                    {item.date && (
                      <p className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerComplaintManagement;