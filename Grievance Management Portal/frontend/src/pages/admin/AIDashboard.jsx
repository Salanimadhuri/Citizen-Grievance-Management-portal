import { useEffect, useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Target, MapPin, Zap } from 'lucide-react';
import { complaintAPI } from '../../services/api';

const AIDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [insightsRes, risksRes] = await Promise.all([
        complaintAPI.getAIInsights(),
        complaintAPI.getEscalationRisks()
      ]);
      
      setInsights(insightsRes.data);
      setRisks(risksRes.data);
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading AI insights...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="text-blue-600" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Governance Dashboard</h1>
          <p className="text-gray-600">Intelligent insights and predictive analytics</p>
        </div>
      </div>

      {/* AI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">AI Processed</p>
              <p className="text-2xl font-bold">{insights?.aiProcessed || 0}</p>
            </div>
            <Brain size={24} />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">High Risk</p>
              <p className="text-2xl font-bold">{risks.length}</p>
            </div>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Hotspots</p>
              <p className="text-2xl font-bold">{insights?.trends?.emergingHotspots?.length || 0}</p>
            </div>
            <MapPin size={24} />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Auto-Classified</p>
              <p className="text-2xl font-bold">{Math.round((insights?.aiProcessed / insights?.totalComplaints) * 100) || 0}%</p>
            </div>
            <Target size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalation Risks */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Escalation Risks</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {risks.length > 0 ? (
              risks.map((complaint) => (
                <div key={complaint._id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{complaint.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      complaint.riskAnalysis.riskScore > 80 ? 'bg-red-100 text-red-700' :
                      complaint.riskAnalysis.riskScore > 60 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Risk: {complaint.riskAnalysis.riskScore}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{complaint.category}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Priority: {complaint.priorityScore}/100</span>
                    <span>ETA: {complaint.riskAnalysis.predictedDaysToResolve} days</span>
                    {complaint.riskAnalysis.shouldEscalate && (
                      <span className="text-red-600 font-semibold">⚠ Escalate Now</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="mx-auto mb-2 text-gray-300" size={32} />
                <p>No high-risk complaints detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Analytics */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Category Analytics</h2>
          </div>
          <div className="space-y-3">
            {insights?.categoryStats && Object.entries(insights.categoryStats).map(([category, stats]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <p className="text-sm text-gray-600">{stats.count} complaints</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">Avg Priority: {stats.avgPriority}</p>
                  <p className="text-xs text-red-600">{stats.escalated} escalated</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emerging Hotspots */}
      {insights?.trends?.emergingHotspots?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-green-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">🔥 Emerging Hotspots</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.trends.emergingHotspots.map((hotspot, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-orange-500" size={16} />
                  <h4 className="font-medium text-gray-900">Location {index + 1}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {hotspot.totalComplaints} total complaints
                </p>
                <p className="text-sm text-orange-600 font-semibold mb-2">
                  {hotspot.recentComplaints} recent complaints
                </p>
                <div className="flex flex-wrap gap-1">
                  {hotspot.categories.map((cat, i) => (
                    <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Features Summary */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">AI Features Active</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Semantic Duplicate Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Auto-Classification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Priority Prediction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Escalation Risk Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;