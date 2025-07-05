import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

type Submission = {
  _id: string;
  fullName: string;
  submissionId: string;
  status: string;
  dateOfBirth?: string;
  email?: string;
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filtered, setFiltered] = useState<Submission[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status' | ''>('');
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log('Getting submissions');
        const res = await api.get('/submissions');
        console.log('📦 Submissions fetched:', res.data);
        setSubmissions(res.data);
        setFiltered(res.data);
      } catch (err: any) {
        console.error('❌ Fetch error:', err.response?.status, err.response?.data);
        alert('Unauthorized or session expired');
        navigate('/admin/login');
      }
    };

    fetchSubmissions();
  }, [navigate]);

  useEffect(() => {
    let updated = [...submissions];

    // Search filter
    if (search.trim()) {
      updated = updated.filter((s) =>
        s.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort logic
    if (sortBy === 'name') {
      updated.sort((a, b) =>
        sortAsc
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName)
      );
    } else if (sortBy === 'date') {
      updated.sort((a, b) => {
        const da = new Date(a.dateOfBirth || '');
        const db = new Date(b.dateOfBirth || '');
        return sortAsc ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
      });
    } else if (sortBy === 'status') {
      updated.sort((a, b) =>
        sortAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      );
    }

    setFiltered(updated);
  }, [search, sortBy, sortAsc, submissions]);

  const toggleSort = (type: 'name' | 'date' | 'status') => {
    if (sortBy === type) {
      setSortAsc(!sortAsc); // toggle
    } else {
      setSortBy(type);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-1.5 rounded shadow-sm text-sm w-64"
        />
        <div className="space-x-2">
          <button
            onClick={() => toggleSort('name')}
            className="px-3 py-1.5 text-sm rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border"
          >
            Sort by Name {sortBy === 'name' && (sortAsc ? '▲' : '▼')}
          </button>
          <button
            onClick={() => toggleSort('date')}
            className="px-3 py-1.5 text-sm rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border"
          >
            Sort by DOB {sortBy === 'date' && (sortAsc ? '▲' : '▼')}
          </button>
          <button
            onClick={() => toggleSort('status')}
            className="px-3 py-1.5 text-sm rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border"
          >
            Sort by Status {sortBy === 'status' && (sortAsc ? '▲' : '▼')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Submission ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50 text-sm">
                <td className="p-2 border">{s.fullName}</td>
                <td className="p-2 border">{s.submissionId}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">
  {s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('en-IN') : '-'}
</td>
                <td className="p-2 border text-center">
                  <Link
                    to={`/admin/submission/${s._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View & Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No submissions found.</p>
        )}
      </div>
    </div>
  );
}
