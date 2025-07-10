"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useParams } from 'next/navigation';

export default function AdProfilePage() {
  const params = useParams();
  const email = params?.email as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const db = getFirestore(app);
        const docRef = doc(db, "admins", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // Show empty profile with dashes for missing fields
          setProfile({
            fullName: "-",
            phone: "-",
            gender: "-",
            dob: "-",
            location: "-",
            createdAt: "-"
          });
        }
      } catch (err: any) {
        setError("Failed to fetch profile: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchProfile();
  }, [email]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Name:</strong> {profile.fullName || "-"}</p>
      <p><strong>Phone:</strong> {profile.phone || "-"}</p>
      <p><strong>Gender:</strong> {profile.gender || "-"}</p>
      <p><strong>Date of Birth:</strong> {profile.dob || "-"}</p>
      <p><strong>Location:</strong> {profile.location || "-"}</p>
      <p><strong>Created At:</strong> {profile.createdAt && profile.createdAt !== '-' ? new Date(profile.createdAt.seconds ? profile.createdAt.seconds * 1000 : profile.createdAt).toLocaleString() : "-"}</p>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
