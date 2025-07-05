import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type FormFields = {
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
};

type FileFields = {
  aadhaarFile?: File;
  photoFile?: File;
  signatureFile?: File;
};

type SubmissionResponse = {
  _id: string;
  submissionId: string;
  status: string;
};

export default function UserForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormFields>({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
  });

  const [files, setFiles] = useState<FileFields>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const sanitizeText = (text: string) => text.trim();

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const fullName = sanitizeText(form.fullName);
    const address = sanitizeText(form.address);
    const email = sanitizeText(form.email);
    const phone = sanitizeText(form.phoneNumber);
    const dob = new Date(form.dateOfBirth);

    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!address) newErrors.address = 'Address is required.';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address.';
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }

    if (!form.dateOfBirth || isNaN(dob.getTime())) {
      newErrors.dateOfBirth = 'Invalid date of birth.';
    } else {
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();
      const hasHadBirthday = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
      const realAge = hasHadBirthday ? age : age - 1;

      if (realAge < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old.';
      }
    }

    const validImageTypes = ['image/jpeg', 'image/png'];

    if (!files.aadhaarFile || files.aadhaarFile.type !== 'application/pdf') {
      newErrors.aadhaarFile = 'Aadhaar must be a PDF file.';
    }

    if (!files.photoFile || !validImageTypes.includes(files.photoFile.type)) {
      newErrors.photoFile = 'Photo must be JPG or PNG.';
    }

    if (!files.signatureFile || !validImageTypes.includes(files.signatureFile.type)) {
      newErrors.signatureFile = 'Signature must be JPG or PNG.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && name) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, sanitizeText(val)));
    Object.entries(files).forEach(([key, val]) => formData.append(key, val as Blob));

    setLoading(true);

    try {
      const res = await api.post<SubmissionResponse>('/submissions', formData);
      alert(`✅ Submitted!\nYour Submission ID: ${res.data.submissionId}`);
      setForm({
        fullName: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        address: '',
      });
      
      setFiles({});
      setErrors({});
    } catch (err) {
      alert('❌ Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/admin/login')}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          🔐 Admin Login
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-medium">Submitting your application...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Learner Licence Application
            </h2>

            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={key === 'dateOfBirth' ? 'date' : 'text'}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            {(['aadhaarFile', 'photoFile', 'signatureFile'] as const).map((name) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {name.replace('File', '')}
                </label>
                <input
                  type="file"
                  name={name}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
            >
              📤 Submit Application
            </button>
          </>
        )}
      </div>
    </div>
  );
}
