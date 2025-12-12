// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// HealthMonitor — global listener that shows the "cloud waking up" UI when API health checks are waiting
import HealthMonitor from './components/common/HealthMonitor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Mount the HealthMonitor once — it renders nothing unless an API call is blocked waiting for health */}
        <HealthMonitor />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
