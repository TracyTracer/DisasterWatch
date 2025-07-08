'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
        className="block mb-4 p-2 border rounded w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
