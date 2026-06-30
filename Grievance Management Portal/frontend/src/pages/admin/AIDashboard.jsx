import { useEffect, useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Target, Zap, BarChart2, Smile, Frown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';

const ML_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'];

const SentimentIcon = ({ s }) => {
  if (s === 'Positive') return <Smile className="text-green-500" size={16} />;
  if (s === 'Negative') return <Frown className="text-red-500" size={16} />;
  return <Minus className="text-gray-400" size={16} />;
};

const AIDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [mlStatus, setMlStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchComplaints(), checkMLHealth()]).finally(() => setLoading(false));
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      const data = res.data?.data || res.data || [];
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setComplaints([]);
    }
  };

  const checkMLHealth = async () => {
    try {
      const res = await fetch(`${ML_URL}/health`);
      const json = await res.json();
      setMlStatus(json.status === 'healthy' ? 'online' : 'offline');
    } catch {
      setMlStatus('offline');
    }
  };

  // Derive charts from AI fields stored on complaints
  const categoryCounts = complaints.reduce((acc, c) => {
    const key = c.aiCategory || c.category || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const priorityCounts = complaints.reduce((acc, c) => {
    const key = c.aiPriority || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  const sentimentCounts = complaints.reduce((acc, c) => {
    const key = c.aiSentiment || 'Neutral';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const aiProcessed = complaints.filter(c => c.aiCategory).length;
  const highRisk = complaints.filter(c => c.aiPriority === 'High' && !['Resolved'].includes(c.status));
  const pct = complaints.length > 0 ? Math.round((aiProcessed / complaints.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="text-blue-600" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Governance Dashboard</h1>
            <p className="text-gray-500 text-sm">Powered by FastAPI ML Microservice</p>
          </div>
        </div>
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          mlStatus === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${mlStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          ML Service {mlStatus}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'AI Processed', value: aiProcessed, icon: Brain, gradient: 'from-blue-500 to-blue-600' },
          { label: 'High Risk', value: highRisk.length, icon: AlertTriangle, gradient: 'from-red-500 to-orange-500' },
          { label: 'Total Complaints', value: complaints.length, icon: BarChart2, gradient: 'from-purple-500 to-purple-600' },
          { label: 'AI Coverage', value: `${pct}%`, icon: Target, gradient: 'from-green-500 to-green-600' },
        ].map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className={`bg-gradient-to-r ${gradient} rounded-xl p-4 text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon size={22} className="opacity-80" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> AI Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-orange-500" /> Priority Prediction
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment + High Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Sentiment Distribution</h2>
          <div className="space-y-3">
            {Object.entries(sentimentCounts).map(([label, count]) => (
              <div key={label} className="flex items-center gap-3">
                <SentimentIcon s={label} />
                <span className="w-20 text-sm text-gray-600">{label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${label === 'Positive' ? 'bg-green-500' : label === 'Negative' ? 'bg-red-500' : 'bg-gray-400'}`}
                    style={{ width: complaints.length > 0 ? `${(count / complaints.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> High Priority Unresolved
          </h2>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {highRisk.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No high-risk complaints</p>
            ) : highRisk.map((c) => (
              <div key={c.id || c._id} className="flex items-start justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.aiCategory || c.category} · {c.status}</p>
                  {c.aiSummary && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.aiSummary}</p>}
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold ml-2 flex-shrink-0">High</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Brain size={18} className="text-blue-600" /> Active AI Features
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Auto Classification', 'Priority Prediction', 'Sentiment Analysis', 'Complaint Summarization', 'Duplicate Detection', 'Dept Recommendation'].map(f => (
            <div key={f} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mlStatus === 'online' ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
              <span className="text-sm text-gray-700">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;
