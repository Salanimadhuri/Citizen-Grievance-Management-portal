import { MapPin, Calendar, Tag, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

const ComplaintCard = ({ complaint, basePath = '/citizen' }) => {
  const navigate = useNavigate();

  // Safe data access with fallbacks
  const safeComplaint = {
    _id: complaint?._id || complaint?.id,
    title: complaint?.title || 'Untitled Complaint',
    description: complaint?.description || 'No description available',
    status: complaint?.status || 'Submitted',
    category: complaint?.category || 'General',
    location: complaint?.location || {},
    createdAt: complaint?.createdAt || new Date(),
    userId: complaint?.userId || { name: 'Unknown Citizen' },
    departmentId: complaint?.departmentId || { name: 'N/A' },
    feedbackSubmitted: complaint?.feedbackSubmitted || false
  };

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`${basePath}/complaints/${safeComplaint._id}`)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{safeComplaint.title}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={safeComplaint.status} />
          {safeComplaint.status === 'Resolved' && (
            <div className="flex items-center gap-1">
              {safeComplaint.feedbackSubmitted ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                  <Star size={12} className="fill-current" />
                  Feedback Given
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                  <Star size={12} />
                  Feedback Pending
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{safeComplaint.description}</p>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Tag size={16} />
          <span>{safeComplaint.category}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>
            {safeComplaint.location?.latitude && safeComplaint.location?.longitude
              ? `${safeComplaint.location.latitude.toFixed(4)}, ${safeComplaint.location.longitude.toFixed(4)}`
              : 'Location not specified'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{new Date(safeComplaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
