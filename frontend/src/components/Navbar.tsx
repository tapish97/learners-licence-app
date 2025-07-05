import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../auth';

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Submit Form', to: '/form' },
  { name: 'Admin Login', to: '/admin/login' }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    console.log('🚪 Logged out');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-blue-600 tracking-tight">
          Learner’s Licence
        </Link>

        <div className="flex space-x-4 items-center">
          {navItems.map(({ name, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
                location.pathname === to
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
              }`}
            >
              {name}
            </Link>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
