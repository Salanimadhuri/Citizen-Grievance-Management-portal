import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, List, MessageSquare, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const menuItems = [
  { path: '/citizen/dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { path: '/citizen/submit',         label: 'Submit Complaint', icon: FileText },
  { path: '/citizen/complaints',     label: 'My Complaints',    icon: List },
  { path: '/citizen/feedback',       label: 'Feedback',         icon: MessageSquare },
  { path: '/citizen/communication',  label: 'Communication',    icon: MessageCircle },
];

const CitizenLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <Navbar />
    <div className="flex">
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 p-6 min-w-0">
        <Outlet />
      </main>
    </div>
  </div>
);

export default CitizenLayout;
