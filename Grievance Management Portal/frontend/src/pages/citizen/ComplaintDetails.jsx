import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import { pdfAPI, complaintReopenAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { MapPin, Calendar, Tag, ArrowLeft, CheckCircle, Download, RotateCcw } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reopenModal, setReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isOfficerView = location.pathname.includes('/officer/');

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  useEffect(() => {
    if (complaint?.location?.latitude && complaint?.location?.longitude && !mapRef.current) {
      initializeMap();
    }
  }, [complaint]);

  const initializeMap = () => {
    if (typeof window !== 'undefined' && window.L && complaint?.location?.latitude) {
      const map = window.L.map('officer-complaint-map').setView([
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

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await pdfAPI.downloadComplaint(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `complaint-${id.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleReopen = async () => {
    if (!reopenReason.trim()) return;
    try {
      setReopening(true);
      await complaintReopenAPI.reopen(id, reopenReason);
      setReopenModal(false);
      setReopenReason('');
      fetchComplaintDetails();
    } catch (err) {
      console.error('Reopen error:', err);
    } finally {
      setReopening(false);
    }
  };

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching complaint details for ID:', id);
      console.log('Current path:', location.pathname);
      
      const response = isOfficerView 
        ? await complaintAPI.getOfficerById(id)
        : await complaintAPI.getById(id);
        
      const data = response?.data?.data || response?.data;
      setComplaint(data);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
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
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  if (!complaint) {
    return <div className="card text-center py-12"><p className="text-gray-600">Complaint not found</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
          {!isOfficerView && complaint?.status === 'Resolved' && (
            <button
              onClick={() => setReopenModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reopen
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Tag size={16} />
                {complaint.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{complaint.description}</p>
          </div>

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
            {complaint.location?.latitude && complaint.location?.longitude ? (
              <div id="officer-complaint-map" className="h-64 rounded-lg border border-gray-300 mb-4"></div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border border-gray-300">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No location data available</p>
                </div>
              </div>
            )}
          </div>

          {complaint.images && complaint.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Evidence</h3>
              <div className="grid grid-cols-3 gap-3">
                {complaint.images.map((img, index) => (
                  <img key={index} src={img} alt={`Evidence ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-6">Status Timeline</h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.active ? 'bg-primary-500' : 'bg-gray-300'}`}>
                {item.active && <CheckCircle size={18} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>{item.status}</p>
                {item.date && <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {reopenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reopen Complaint</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for reopening this complaint.</p>
            <textarea
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              rows={4}
              className="input-field resize-none mb-4"
              placeholder="Reason for reopening..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReopen}
                disabled={reopening || !reopenReason.trim()}
                className="btn-primary flex-1"
              >
                {reopening ? 'Reopening...' : 'Confirm Reopen'}
              </button>
              <button
                onClick={() => { setReopenModal(false); setReopenReason(''); }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
