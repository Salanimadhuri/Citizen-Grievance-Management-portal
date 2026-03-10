const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Submitted': 'bg-gray-100 text-gray-700 border-gray-300',
    'Under Review': 'bg-blue-100 text-blue-700 border-blue-300',
    'Assigned': 'bg-purple-100 text-purple-700 border-purple-300',
    'In Progress': 'bg-orange-100 text-orange-700 border-orange-300',
    'Work Scheduled': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[status] || statusConfig['Submitted']}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
