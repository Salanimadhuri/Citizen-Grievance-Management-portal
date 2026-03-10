import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#1976D2', '#FF9800', '#4CAF50', '#F44336', '#9C27B0'];

const StatisticsCharts = ({ complaints = [] }) => {
  // Prepare data for charts
  const getStatusDistribution = () => {
    const statusCount = {};
    complaints.forEach(c => {
      const status = c.status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const getCategoryDistribution = () => {
    const categoryCount = {};
    complaints.forEach(c => {
      const category = c.category || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  const getTimelineData = () => {
    const timeline = {};
    complaints.forEach(c => {
      const date = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
      timeline[date] = (timeline[date] || 0) + 1;
    });
    return Object.entries(timeline).map(([date, count]) => ({ date, count })).slice(-7);
  };

  const getResolutionRate = () => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    return total > 0 ? Math.round((resolved / total) * 100) : 0;
  };

  const statusData = getStatusDistribution();
  const categoryData = getCategoryDistribution();
  const timelineData = getTimelineData();
  const resolutionRate = getResolutionRate();

  return (
    <div className="space-y-6">
      {/* Resolution Rate Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-600">{resolutionRate}%</div>
            <p className="text-gray-600 mt-2">of complaints resolved</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        {statusData.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Distribution Bar Chart */}
        {categoryData.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976D2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Timeline Chart */}
      {timelineData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Over Time (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1976D2" strokeWidth={2} name="Complaints" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatisticsCharts;
