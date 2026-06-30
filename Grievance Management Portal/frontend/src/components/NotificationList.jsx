import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { notificationAPI } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationList = ({ limit = 5 }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // works whether backend returns id or _id
  const getId = (n) => n.id || n._id;
  const isUnread = (n) => !n.isRead && !n.read;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      const data = response.data;
      setNotifications(Array.isArray(data) ? data.slice(0, limit) : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => getId(n) === id ? { ...n, isRead: true, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(n => getId(n) !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (isUnread(notification)) handleMarkAsRead(getId(notification));
    if (notification.complaintId) {
      const complaintId = typeof notification.complaintId === 'object'
        ? notification.complaintId.id || notification.complaintId._id || notification.complaintId.toString()
        : notification.complaintId;
      navigate(`/citizen/complaints/${complaintId}`);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell size={20} className="text-primary-600" />
          Recent Notifications
        </h3>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell size={48} className="mx-auto mb-2 text-gray-300" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={getId(notification)}
              className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                isUnread(notification)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isUnread(notification) && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    )}
                    <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.createdAt)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {isUnread(notification) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(getId(notification)); }}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(getId(notification)); }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
