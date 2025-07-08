'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect to login if already logged out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // redirect to login page
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      alert('You have been logged out');
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        alert('Logout failed: ' + error.message);
      } else {
        alert('Logout failed: Unknown error');
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout} disabled={loading} aria-busy={loading}>
        {loading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}
