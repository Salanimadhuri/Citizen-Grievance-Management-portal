import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCog, Building2, Users, BarChart3, Map, UserCheck, Brain } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/ai-dashboard', label: 'AI Governance', icon: Brain },
    { path: '/admin/complaints', label: 'Complaint Management', icon: FileText },
    { path: '/admin/assign', label: 'Assign Complaints', icon: UserCog },
    { path: '/admin/departments', label: 'Manage Departments', icon: Building2 },
    { path: '/admin/officers', label: 'Manage Officers', icon: Users },
    { path: '/admin/officer-requests', label: 'Officer Requests', icon: UserCheck },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/heatmap', label: 'Heatmap View', icon: Map },
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

export default AdminLayout;
