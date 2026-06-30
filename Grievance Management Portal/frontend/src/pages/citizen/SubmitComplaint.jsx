import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import MapPicker from '../../components/MapPicker';
import ImageUpload from '../../components/ImageUpload';
import { CheckCircle, AlertCircle, Brain, Zap, Tag, Building2 } from 'lucide-react';

const ML_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

const CATEGORIES = [
  'Road & Infrastructure', 'Water Supply', 'Electricity',
  'Waste Management', 'Public Safety', 'Other',
];

const PRIORITY_COLORS = { High: 'text-red-600 bg-red-50', Medium: 'text-yellow-600 bg-yellow-50', Low: 'text-green-600 bg-green-50' };

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    location: { latitude: 13.6288, longitude: 79.4192 },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Debounced AI preview — triggers 800ms after user stops typing
  useEffect(() => {
    const text = formData.description.trim();
    if (text.length < 20) { setAiPreview(null); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await fetch(`${ML_URL}/api/ml/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formData.title, text }),
        });
        if (res.ok) setAiPreview(await res.json());
      } catch { /* ML service offline — silently skip */ }
      finally { setAiLoading(false); }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [formData.description, formData.title]);

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
      images.forEach((img) => submitData.append('images', img));

      await complaintAPI.create(submitData);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
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
          <CheckCircle size={20} /><span>Complaint submitted successfully! Redirecting...</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} /><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Complaint Title</label>
          <input type="text" value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field" placeholder="Brief title of your complaint" required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5} className="input-field resize-none"
            placeholder="Provide detailed information about the issue..." required />
        </div>

        {/* AI Preview Panel */}
        {(aiLoading || aiPreview) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">AI Analysis Preview</span>
              {aiLoading && <span className="text-xs text-blue-500 animate-pulse">analyzing...</span>}
            </div>
            {aiPreview && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-600">Category:</span>
                  <span className="text-xs font-semibold text-blue-700">{aiPreview.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-600">Priority:</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${PRIORITY_COLORS[aiPreview.priority] || ''}`}>
                    {aiPreview.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-600">Dept:</span>
                  <span className="text-xs font-semibold text-purple-700">{aiPreview.recommendedDepartment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Sentiment:</span>
                  <span className="text-xs font-semibold text-gray-700">{aiPreview.sentiment}</span>
                </div>
                {aiPreview.summary && (
                  <div className="col-span-2">
                    <span className="text-xs text-gray-600">Summary: </span>
                    <span className="text-xs text-gray-700 italic">{aiPreview.summary}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="label">Category</label>
          <select value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field" required>
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {aiPreview?.category && formData.category === '' && (
            <button type="button" onClick={() => setFormData({ ...formData, category: aiPreview.category })}
              className="mt-1 text-xs text-blue-600 hover:underline">
              Use AI suggestion: {aiPreview.category}
            </button>
          )}
        </div>

        <div>
          <MapPicker onLocationSelect={(location) => setFormData({ ...formData, location })}
            initialLocation={{ lat: formData.location.latitude, lng: formData.location.longitude }} />
        </div>

        <div>
          <ImageUpload onImageSelect={setImages} maxFiles={3} maxSize={5} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button type="button" onClick={() => navigate('/citizen/complaints')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
