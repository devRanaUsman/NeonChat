import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChatPage from './pages/ChatPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="h-full flex items-center justify-center bg-[#0A0F1E]"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] animate-pulse"></div></div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="h-full flex items-center justify-center bg-[#0A0F1E]"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] animate-pulse"></div></div>;
  }
  
  return isAuthenticated ? <Navigate to="/chat" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="h-full">
            <Routes>
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
