import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import UserForm from './pages/CustomerForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SubmissionDetail from './pages/SubmissionDetail';
import Navbar from './components/Navbar';
import { getToken } from './auth';

const App = () => {
  const location = useLocation();
  const key = location.pathname;

  console.log('📍 Current route:', location.pathname);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getToken();
    console.log('🔐 PrivateRoute token:', token);
    return token ? children : <Navigate to="/admin/login" replace />;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes key={key}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<UserForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/submission/:id"
            element={
              <PrivateRoute>
                <SubmissionDetail />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
