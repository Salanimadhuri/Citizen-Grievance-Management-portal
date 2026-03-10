import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import MapPicker from '../../components/MapPicker';
import ImageUpload from '../../components/ImageUpload';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { latitude: 13.6288, longitude: 79.4192 },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Road & Infrastructure',
    'Water Supply',
    'Electricity',
    'Waste Management',
    'Public Safety',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', JSON.stringify(formData.location));
      
      images.forEach((image) => {
        submitData.append('images', image);
      });

      await complaintAPI.create(submitData);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit New Complaint</h1>
        <p className="text-gray-600">Fill in the details to register your grievance</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>Complaint submitted successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Complaint Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            placeholder="Brief title of your complaint"
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="input-field resize-none"
            placeholder="Provide detailed information about the issue..."
            required
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <MapPicker
            onLocationSelect={(location) => setFormData({ ...formData, location })}
            initialLocation={{ lat: formData.location.latitude, lng: formData.location.longitude }}
          />
        </div>

        <div>
          <ImageUpload onImageSelect={setImages} maxFiles={3} maxSize={5} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/citizen/complaints')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
