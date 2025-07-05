import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Learner’s Licence Application</h1>
      <p className="text-gray-600 mb-8">Submit your application</p>
      <div className="flex justify-center gap-6">
        <Link to="/form" className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit Form</Link>
        <Link to="/admin/login" className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Admin Login</Link>
      </div>
    </div>
  );
}