import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { complaintAPI, departmentAPI, officerAPI } from '../../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ComplaintAssignment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [formData, setFormData] = useState({
    complaintId: searchParams.get('complaintId') || '',
    departmentId: '',
    officerId: '',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.departmentId) {
      fetchOfficers(formData.departmentId);
    }
  }, [formData.departmentId]);

  const fetchData = async () => {
    try {
      const [complaintsRes, departmentsRes] = await Promise.all([
        complaintAPI.getAll({ status: 'Submitted' }),
        departmentAPI.getAll(),
      ]);
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);
      setDepartments(Array.isArray(departmentsRes.data) ? departmentsRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchOfficers = async (deptId) => {
    try {
      const response = await officerAPI.getAll();
      const allOfficers = Array.isArray(response.data) ? response.data : [];
      const filteredOfficers = allOfficers.filter(officer =>
        officer.department === deptId || officer.department?._id === deptId
      );
      setOfficers(filteredOfficers);
    } catch (error) {
      console.error('Error fetching officers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await complaintAPI.assign(formData.complaintId, {
        departmentId: formData.departmentId,
        officerId: formData.officerId,
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/complaints'), 2000);
    } catch (err) {
      setError('Failed to assign complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assign Complaint</h1>
        <p className="text-gray-600">Assign complaints to departments and officers</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>Complaint assigned successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Select Complaint</label>
          <select
            value={formData.complaintId}
            onChange={(e) => setFormData({ ...formData, complaintId: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Choose a complaint</option>
            {complaints.map((complaint) => (
              <option key={complaint.id || complaint._id} value={complaint.id || complaint._id}>
                #{(complaint.id || complaint._id || '').slice(-6)} - {complaint.title} ({complaint.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Department</label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, officerId: '' })}
            className="input-field"
            required
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.id || dept._id} value={dept.id || dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Assign to Officer</label>
          <select
            value={formData.officerId}
            onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
            className="input-field"
            required
            disabled={!formData.departmentId}
          >
            <option value="">Select officer</option>
            {officers.length === 0 && formData.departmentId && (
              <option value="" disabled>No officers found for this department</option>
            )}
            {officers.map((officer) => (
              <option key={officer.id || officer._id} value={officer.id || officer._id}>
                {officer.name} - {officer.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Priority Score</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="input-field"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Assigning...' : 'Assign Complaint'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/complaints')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintAssignment;
