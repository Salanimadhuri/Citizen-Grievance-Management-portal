import { useEffect, useState } from 'react';
import { officerAPI, departmentAPI } from '../../services/api';
import { Plus, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';

const ManageOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    departmentId: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officersRes, departmentsRes] = await Promise.all([
        officerAPI.getAll(),
        departmentAPI.getAll(),
      ]);
      setOfficers(officersRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingOfficer) {
        await officerAPI.update(editingOfficer._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.departmentId,
        });
        setSuccess('Officer updated successfully');
      } else {
        await officerAPI.create(formData);
        setSuccess('Officer added successfully');
      }
      fetchData();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(editingOfficer ? 'Failed to update officer' : 'Failed to add officer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', departmentId: '' });
    setEditingOfficer(null);
    setShowForm(false);
  };

  const handleEdit = (officer) => {
    setEditingOfficer(officer);
    setFormData({
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      password: '',
      departmentId: officer.department?._id || '',
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Officers</h1>
          <p className="text-gray-600">Add and manage department officers</p>
        </div>
        <button
          onClick={() => {
            setEditingOfficer(null);
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Officer
        </button>
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

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingOfficer ? 'Edit Officer' : 'Add New Officer'}
          </h3>

          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="officer@example.com"
              required
            />
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              required={!editingOfficer}
            />
            {editingOfficer && (
              <p className="text-sm text-gray-500 mt-1">Leave blank to keep current password</p>
            )}
          </div>

          <div>
            <label className="label">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              {editingOfficer ? 'Update Officer' : 'Add Officer'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
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
            {officers.map((officer) => (
              <tr key={officer._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{officer.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{officer.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{officer.phone}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{officer.department?.name || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    officer.status === 'approved' ? 'bg-green-100 text-green-700' :
                    officer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {officer.status || 'pending'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(officer)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit Officer"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {officers.length === 0 && (
          <div className="text-center py-12 text-gray-600">No officers found</div>
        )}
      </div>
    </div>
  );
};

export default ManageOfficers;
