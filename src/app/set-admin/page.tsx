'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

type SetAdminResponse = {
  message: string;
};

export default function SetAdminPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSetAdmin = async () => {
    const functions = getFunctions(app);
    const setAdmin = httpsCallable(functions, 'setAdmin');

    try {
      const result = await setAdmin({ email });
      const data = result.data as SetAdminResponse;
      setMessage(data.message);
    } catch (error: any) {
      setMessage('Failed to set admin: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Grant Admin Role</h2>
      <input
        type="email"
        placeholder="Enter email to make admin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSetAdmin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Set as Admin
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
