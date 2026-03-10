import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import api from '../../services/api';

const OfficerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
    // Initialize EmailJS
    emailjs.init('pWiGdaj5MKAhJn1nP');
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/officer-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendOfficerStatusEmail = (officerName, officerEmail, status) => {
    emailjs.send(
      'service_7y5jtnq',
      'template_8i5btvp',
      {
        officer_name: officerName,
        status: status,
        email: officerEmail
      },
      'pWiGdaj5MKAhJn1nP'
    )
      .then((result) => {
        console.log('Email sent successfully', result.text);
      })
      .catch((error) => {
        console.error('Email sending failed', error);
      });
  };

  const handleApprove = async (request) => {
    try {
      await api.patch(`/admin/approve-officer/${request._id}`);
      sendOfficerStatusEmail(request.name, request.email, 'approved');
      setSuccess('Officer approved successfully');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve officer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async (request) => {
    try {
      await api.patch(`/admin/reject-officer/${request._id}`);
      sendOfficerStatusEmail(request.name, request.email, 'rejected');
      setSuccess('Officer rejected successfully');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject officer');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Officer Requests</h1>
        <p className="text-gray-600">Review and approve officer registration requests</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{request.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{request.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{request.phone}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{request.department?.name || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                    <Clock size={12} />
                    Pending
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
                      title="Reject"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {requests.length === 0 && (
          <div className="text-center py-12 text-gray-600">No pending officer requests</div>
        )}
      </div>
    </div>
  );
};

export default OfficerRequests;
