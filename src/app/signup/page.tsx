'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const locations = [
    'Kachin', 'Kayah', 'Kayin', 'Chin', 'Mon', 'Rakhine', 'Shan',
    'AyeYaWaddy', 'Bago', 'Magway', 'Tanintharyi', 'Yangon',
    'Mandalay', 'Sagaing', 'NayPyiDaw'
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add user info to Firestore 'user' collection
      await addDoc(collection(firestore, 'user'), {
        uid: userCredential.user.uid,
        email,
        location,
        createdAt: new Date()
      });
      alert('Signup successful!');
      console.log(userCredential.user);
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-2 p-2 border rounded w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-2 p-2 border rounded w-full"
      />
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="block mb-4 p-2 border rounded w-full"
        required
      >
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
