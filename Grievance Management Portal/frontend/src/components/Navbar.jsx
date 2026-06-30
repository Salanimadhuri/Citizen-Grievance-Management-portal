import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5L43Bm7seuRYi53lm-CSbm0uP81vizDj05Q&s" 
            alt="Grievance Portal Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Citizen Grievance Management Portal</h1>
            <p className="text-xs text-gray-500 capitalize">{user?.role} Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary-700" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
