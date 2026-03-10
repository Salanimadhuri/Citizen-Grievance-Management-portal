import { useEffect, useState } from 'react';
import { departmentAPI } from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slaHours: '',
    contactEmail: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await departmentAPI.update(editingId, formData);
        setSuccess('Department updated successfully');
      } else {
        await departmentAPI.create(formData);
        setSuccess('Department created successfully');
      }
      
      fetchDepartments();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save department');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name,
      slaHours: dept.slaHours,
      contactEmail: dept.contactEmail,
    });
    setEditingId(dept._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(id);
        setSuccess('Department deleted successfully');
        fetchDepartments();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete department');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slaHours: '', contactEmail: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Departments</h1>
          <p className="text-gray-600">Create and manage departments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Department
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
            {editingId ? 'Edit Department' : 'Add New Department'}
          </h3>

          <div>
            <label className="label">Department Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Public Works"
              required
            />
          </div>

          <div>
            <label className="label">SLA Hours</label>
            <input
              type="number"
              value={formData.slaHours}
              onChange={(e) => setFormData({ ...formData, slaHours: e.target.value })}
              className="input-field"
              placeholder="e.g., 48"
              required
            />
          </div>

          <div>
            <label className="label">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="input-field"
              placeholder="department@example.com"
              required
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Department
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Department Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">SLA Hours</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{dept.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{dept.slaHours} hours</td>
                <td className="py-3 px-4 text-sm text-gray-600">{dept.contactEmail}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-primary-600 hover:text-primary-700"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {departments.length === 0 && (
          <div className="text-center py-12 text-gray-600">No departments found</div>
        )}
      </div>
    </div>
  );
};

export default ManageDepartments;
