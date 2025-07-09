'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        <Link href="/set-admin">
          <div className="p-6 bg-white rounded shadow hover:bg-green-100 cursor-pointer text-center text-xl font-semibold text-black">Admin Management</div>
        </Link>
        <Link href="/set-user">
          <div className="p-6 bg-white rounded shadow hover:bg-blue-100 cursor-pointer text-center text-xl font-semibold text-black">User Management</div>
        </Link>
        <Link href="/set-volunteers">
          <div className="p-6 bg-white rounded shadow hover:bg-yellow-100 cursor-pointer text-center text-xl font-semibold text-black">Volunteers Management</div>
        </Link>
        <Link href="/adProfile">
          <div className="p-6 bg-white rounded shadow hover:bg-purple-100 cursor-pointer text-center text-xl font-semibold text-black">Admin Profile</div>
        </Link>
      </div>
    </div>
  );
}
