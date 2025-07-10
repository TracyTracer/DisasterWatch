'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import Link from 'next/link';

type SetAdminResponse = {
  message: string;
};

export default function SetAdminPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSetAdmin = async () => {
    setMessage('');
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const functions = getFunctions(app);
    const setAdmin = httpsCallable(functions, 'setAdmin');
    try {
      const result = await setAdmin({ email });
      const data = result.data as SetAdminResponse;
      setMessage(data.message);
    } catch (error: any) {
      setError('Failed to set admin: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      setAdminsLoading(true);
      setAdminsError('');
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, 'admins'));
        setAdmins(querySnapshot.docs.map(doc => ({ email: doc.id, ...doc.data() })));
      } catch (err: any) {
        setAdminsError('Failed to fetch admins: ' + err.message);
      } finally {
        setAdminsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Grant Admin Role</h2>
      <input
        type="email"
        placeholder="Enter email to make admin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        disabled={loading}
      />
      <button
        onClick={handleSetAdmin}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Setting...' : 'Set as Admin'}
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-2">All Admins</h3>
      {adminsLoading && <p>Loading admins...</p>}
      {adminsError && <p className="text-red-600">{adminsError}</p>}
      <ul>
        {admins.map((admin) => (
          <li key={admin.email} className="mb-2">
            <Link href={`/admin-profile/${encodeURIComponent(admin.email)}`} className="text-blue-600 underline">
              {admin.fullName || admin.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
