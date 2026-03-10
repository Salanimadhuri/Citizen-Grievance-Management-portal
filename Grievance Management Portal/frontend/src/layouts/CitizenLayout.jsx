import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, List, MessageSquare, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CitizenLayout = () => {
  const menuItems = [
    { path: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/citizen/submit', label: 'Submit Complaint', icon: FileText },
    { path: '/citizen/complaints', label: 'My Complaints', icon: List },
    { path: '/citizen/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/citizen/communication', label: 'Communication', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
