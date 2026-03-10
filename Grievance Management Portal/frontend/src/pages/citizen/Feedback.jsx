import { useEffect, useState } from 'react';
import { complaintAPI, feedbackAPI } from '../../services/api';
import FeedbackForm from '../../components/FeedbackForm';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  const fetchResolvedComplaints = async () => {
    try {
      const response = await complaintAPI.getMy();
      const resolved = response.data.filter(c => 
        c.status === 'Resolved' && !c.feedbackSubmitted
      );
      setResolvedComplaints(resolved);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await feedbackAPI.create(feedbackData);
      setSuccess(true);
      setSelectedComplaint(null);
      fetchResolvedComplaints();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit feedback');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-600">Rate your experience with resolved complaints</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>Feedback submitted successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {resolvedComplaints.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No resolved complaints pending feedback</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {resolvedComplaints.map((complaint) => (
            <div key={complaint._id} className="card">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{complaint.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{complaint.category} • Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
              
              {selectedComplaint === complaint._id ? (
                <FeedbackForm
                  complaintId={complaint._id}
                  onSubmit={handleFeedbackSubmit}
                />
              ) : (
                <button
                  onClick={() => setSelectedComplaint(complaint._id)}
                  className="btn-primary"
                >
                  Provide Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
