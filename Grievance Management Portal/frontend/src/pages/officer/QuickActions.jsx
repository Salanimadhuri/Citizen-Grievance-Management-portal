import { Eye, Edit, MapPin, Upload, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'View Assigned Complaints', icon: Eye, path: '/officer/complaints', description: 'See all complaints assigned to you' },
    { label: 'View In Progress Complaints', icon: Clock, path: '/officer/complaints', description: 'Track complaints currently being worked on' },
    { label: 'View Resolved Complaints', icon: CheckCircle, path: '/officer/complaints', description: 'Review completed complaints' },
    { label: 'Update Complaint Status', icon: Edit, path: '/officer/complaints', description: 'Change status of assigned complaints' },
    { label: 'View Complaint Location', icon: MapPin, path: '/officer/complaints', description: 'View complaint locations on map' },
    { label: 'View Evidence Images', icon: Upload, path: '/officer/complaints', description: 'Review complaint evidence and attachments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quick Actions</h1>
        <p className="text-gray-600">Access common complaint management tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="card flex flex-col items-start justify-start p-6 hover:shadow-md hover:border-primary-300 transition-all group text-left"
          >
            <div className="bg-primary-100 p-3 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
              <action.icon size={24} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">{action.label}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
