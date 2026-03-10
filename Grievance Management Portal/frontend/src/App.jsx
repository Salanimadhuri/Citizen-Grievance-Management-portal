import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Aurora from './components/Aurora';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import OfficerLayout from './layouts/OfficerLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OfficerRegister from './pages/auth/OfficerRegister';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetails from './pages/citizen/ComplaintDetails';
import Feedback from './pages/citizen/Feedback';
import CitizenCommunication from './pages/citizen/CitizenCommunication';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedComplaints from './pages/officer/AssignedComplaints';
import OfficerComplaints from './pages/officer/OfficerComplaints';
import OfficerComplaintManagement from './pages/officer/OfficerComplaintManagement';
import UpdateStatus from './pages/officer/UpdateStatus';
import OfficerFeedback from './pages/officer/OfficerFeedback';
import OfficerCommunication from './pages/officer/OfficerCommunication';
import QuickActions from './pages/officer/QuickActions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails';
import AdminUpdateStatus from './pages/admin/AdminUpdateStatus';
import ComplaintAssignment from './pages/admin/ComplaintAssignment';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageOfficers from './pages/admin/ManageOfficers';
import OfficerRequests from './pages/admin/OfficerRequests';
import Analytics from './pages/admin/Analytics';
import AdminHeatmap from './pages/admin/AdminHeatmap';
import AIDashboard from './pages/admin/AIDashboard';

// Common Pages
import Home from './pages/common/Home';
import About from './pages/common/About';
import NotFound from './pages/common/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          {/* Global Aurora Background */}
          <Aurora
            colorStops={["#d8eed8", "#a0f3b5", "#bbb9c6"]}
            blend={0.5}
            amplitude={1.0}
            speed={1}
          />
          
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/officer-register" element={<OfficerRegister />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/citizen/dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="submit" element={<SubmitComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="communication" element={<CitizenCommunication />} />
          </Route>

          {/* Officer Routes */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="dashboard" element={<OfficerDashboard />} />
            <Route path="complaints" element={<OfficerComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="manage/:id" element={<OfficerComplaintManagement />} />
            <Route path="update/:id" element={<UpdateStatus />} />
            <Route path="quick-actions" element={<QuickActions />} />
            <Route path="feedback" element={<OfficerFeedback />} />
            <Route path="communication" element={<OfficerCommunication />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="ai-dashboard" element={<AIDashboard />} />
            <Route path="complaints" element={<ComplaintManagement />} />
            <Route path="complaints/:id" element={<AdminComplaintDetails />} />
            <Route path="update-status/:id" element={<AdminUpdateStatus />} />
            <Route path="assign" element={<ComplaintAssignment />} />
            <Route path="departments" element={<ManageDepartments />} />
            <Route path="officers" element={<ManageOfficers />} />
            <Route path="officer-requests" element={<OfficerRequests />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="heatmap" element={<AdminHeatmap />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
