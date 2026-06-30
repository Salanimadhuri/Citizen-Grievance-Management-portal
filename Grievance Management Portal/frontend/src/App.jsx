import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Aurora from './components/Aurora';

import CitizenLayout from './layouts/CitizenLayout';
import OfficerLayout from './layouts/OfficerLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OfficerRegister from './pages/auth/OfficerRegister';
import ForgotPassword from './pages/auth/ForgotPassword';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetails from './pages/citizen/ComplaintDetails';
import Feedback from './pages/citizen/Feedback';
import CitizenCommunication from './pages/citizen/CitizenCommunication';

import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedComplaints from './pages/officer/AssignedComplaints';
import OfficerComplaints from './pages/officer/OfficerComplaints';
import OfficerComplaintManagement from './pages/officer/OfficerComplaintManagement';
import UpdateStatus from './pages/officer/UpdateStatus';
import OfficerFeedback from './pages/officer/OfficerFeedback';
import OfficerCommunication from './pages/officer/OfficerCommunication';
import QuickActions from './pages/officer/QuickActions';

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

import Home from './pages/common/Home';
import About from './pages/common/About';
import NotFound from './pages/common/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Aurora
            colorStops={["#1E293B", "#4682B4", "#06B6D4"]}
            blend={0.4}
            amplitude={0.8}
            speed={0.8}
          />
          
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } />
          <Route path="/officer-register" element={
            <ProtectedRoute requireAuth={false}>
              <OfficerRegister />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          } />

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
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
