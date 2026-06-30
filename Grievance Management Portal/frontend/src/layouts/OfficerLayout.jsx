import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Zap, Clock, CheckCircle, Star, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const menuItems = [
  { path: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    path: '/officer/complaints',
    label: 'My Complaints',
    icon: ClipboardList,
    submenu: [
      { path: '/officer/complaints?filter=all',        label: 'All Complaints', icon: ClipboardList },
      { path: '/officer/complaints?filter=assigned',   label: 'Assigned',       icon: ClipboardList },
      { path: '/officer/complaints?filter=inprogress', label: 'In Progress',    icon: Clock },
      { path: '/officer/complaints?filter=resolved',   label: 'Resolved',       icon: CheckCircle },
      { path: '/officer/quick-actions',                label: 'Quick Actions',  icon: Zap },
    ],
  },
  { path: '/officer/feedback',      label: 'Feedback',       icon: Star },
  { path: '/officer/communication', label: 'Communication',  icon: MessageCircle },
];

const OfficerLayout = () => (
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

export default OfficerLayout;
