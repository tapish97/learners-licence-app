import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../auth';
import api from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Redirect if token already exists
  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      if (!token) return;
  
      try {
        await api.get('/auth/verify'); // token included via axios interceptor
        console.log('✅ Token valid. Redirecting...');
        navigate('/admin/dashboard');
      } catch (err) {
        console.warn('⚠️ Token invalid or expired. Staying on login.');
        setToken(''); // clear token
      }
    };
  
    checkToken();
  }, [navigate]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      const { token } = res.data;
      if (!token) throw new Error('No token returned from server');

      setToken(token);
      console.log('✅ Token set. Navigating to dashboard...');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
