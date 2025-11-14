// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { ThemeProvider } from './Contexts/ThemeContext';
import { ToastProvider } from './Components/ToastProvider';
import Login from './Pages/Login';
import SignupInstaller from './Pages/SignupInstaller';
import SignupClient from './Pages/SignupClient';
import InstallerDashboard from './Pages/InstallerDashboard';
import ClientDashboard from './Pages/ClientDashboard';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        currentUser ? (
          <Navigate to={userRole === 'installer' ? '/installer/dashboard' : '/client/dashboard'} />
        ) : (
          <Login />
        )
      } />
      
      <Route path="/signup/installer" element={<SignupInstaller />} />
      <Route path="/signup/client/:inviteCode?" element={<SignupClient />} />
      
      <Route
        path="/installer/dashboard"
        element={
          <ProtectedRoute requiredRole="installer">
            <InstallerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute requiredRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;