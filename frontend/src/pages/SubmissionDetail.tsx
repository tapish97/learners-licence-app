import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

type Submission = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  status: string;
  internalNotes?: string;
  submissionId: string;
  aadhaarFile: string;
  photoFile: string;
  signatureFile: string;
};

const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [status, setStatus] = useState('Pending');
  const [internalNotes, setInternalNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get('/submissions');
        const found = res.data.find((s: Submission) => s._id === id);
        if (!found) throw new Error('Submission not found');

        setSubmission(found);
        setStatus(found.status);
        setInternalNotes(found.internalNotes || '');
      } catch (err: any) {
        console.error('❌ Error loading submission:', err.message || err);
        alert('Could not load submission.');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    } else {
      navigate('/admin/dashboard');
    }
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      await api.patch(`/submissions/${id}/status`, {
        status,
        internalNotes,
      });
      alert('Status updated successfully.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('❌ Error updating status:', err.response?.data || err.message);
      alert('Something went wrong while updating status.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!submission) return <p>Submission not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-8">Submission Details</h2>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 text-sm mb-10">
        <p><strong>Full Name:</strong> {submission.fullName}</p>
        <p><strong>Email:</strong> {submission.email}</p>
        <p><strong>Phone:</strong> {submission.phoneNumber}</p>
        <p><strong>Date of Birth:</strong> {submission.dateOfBirth}</p>
        <p><strong>Address:</strong> {submission.address}</p>
        <p><strong>Submission ID:</strong> {submission.submissionId}</p>
      </div>

      {/* Documents Section */}
      <div className="flex flex-col items-center gap-8 mb-12">
        <h3 className="text-lg font-semibold">Uploaded Documents</h3>

        {/* Aadhaar PDF */}
        <div className="flex flex-col items-center space-y-2">
          <span className="font-medium">Aadhaar</span>
          <a
            href={submission.aadhaarFile}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            View Aadhaar PDF
          </a>
        </div>

        {/* Photo + Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          <div className="flex flex-col items-center space-y-2">
            <span className="font-medium">Photo</span>
            <img
              src={submission.photoFile}
              alt="User Photo"
              className="w-40 h-auto rounded border shadow-md object-cover"
            />
          </div>

          <div className="flex flex-col items-center space-y-2">
            <span className="font-medium">Signature</span>
            <img
              src={submission.signatureFile}
              alt="User Signature"
              className="w-28 h-auto rounded border shadow-sm object-contain"
            />
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Internal Notes</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={4}
            className="border rounded p-2 w-full"
            placeholder="Write internal notes..."
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
