import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Zap, Clock, CheckCircle, Star, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const OfficerLayout = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      path: '/officer/complaints', 
      label: 'My Complaints', 
      icon: ClipboardList,
      submenu: [
        { path: '/officer/complaints?filter=all', label: 'All Complaints', icon: ClipboardList },
        { path: '/officer/complaints?filter=assigned', label: 'Assigned', icon: ClipboardList },
        { path: '/officer/complaints?filter=inprogress', label: 'In Progress', icon: Clock },
        { path: '/officer/complaints?filter=resolved', label: 'Resolved', icon: CheckCircle },
        { path: '/officer/quick-actions', label: 'Quick Actions', icon: Zap },
      ]
    },
    { path: '/officer/feedback', label: 'Feedback', icon: Star },
    { path: '/officer/communication', label: 'Communication', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <Sidebar menuItems={menuItems} />
        </div>
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
