'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔄 Force refresh token to get latest claims
      const tokenResult = await user.getIdTokenResult(true);
      const claims = tokenResult.claims;

      alert('Login successful!');

      // ✅ Redirect based on role
      if (claims.admin) {
        router.push('/admin-dashboard'); // redirect to admin dashboard
      } else {
        router.push('/user-dashboard'); // redirect to user dashboard
      }
    } catch (error: any) {
      alert(error.message);
      console.error('Login error:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </form>
  );
}
