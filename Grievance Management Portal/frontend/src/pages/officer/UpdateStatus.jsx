import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = ['Under Review', 'In Progress', 'Work Scheduled', 'Resolved'];

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await complaintAPI.getOfficerById(id);
      setComplaint(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error('Officer complaint fetch error:', error);
      setError(error.response?.data?.message || 'Complaint not found or not assigned to you');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      console.log('Updating complaint status:', { id, status, remarks });
      const response = await complaintAPI.update(id, { status, remarks });
      console.log('Status update successful:', response.data);
      setSuccess(true);
      // Update local complaint state
      setComplaint(response.data);
      setTimeout(() => navigate('/officer/complaints'), 2000);
    } catch (err) {
      console.error('Status update error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update status';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (error && !complaint) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/officer/complaints')} className="btn-secondary">
          Back to My Complaints
        </button>
      </div>
    );
  }

  if (!complaint) {
    return <div className="card text-center py-12"><p className="text-gray-600">Complaint not found</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Complaint Status</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <CheckCircle size={20} />
            <span>Status updated successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{complaint?.title || 'Untitled'}</h3>
          <p className="text-sm text-gray-600 mb-3">{complaint?.description || 'No description'}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Category: {complaint?.category || 'General'}</span>
            <StatusBadge status={complaint?.status || 'Submitted'} />
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="label">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
              required
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={5}
              className="input-field resize-none"
              placeholder="Add any notes or updates about the complaint..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={updating} className="btn-primary flex-1">
              {updating ? 'Updating...' : 'Update Status'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/officer/complaints')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatus;
