"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
        setProfile(null);
        setError("Not logged in.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
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
            createdAt: "-",
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
  // Remove error check so we always show the profile UI
  // if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Admin Profile</h2>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Name:</strong> {profile.fullName || "-"}
      </p>
      <p>
        <strong>Phone:</strong> {profile.phone || "-"}
      </p>
      <p>
        <strong>Gender:</strong> {profile.gender || "-"}
      </p>
      <p>
        <strong>Date of Birth:</strong> {profile.dob || "-"}
      </p>
      <p>
        <strong>Location:</strong> {profile.location || "-"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {profile.createdAt && profile.createdAt !== "-"
          ? new Date(
              profile.createdAt.seconds
                ? profile.createdAt.seconds * 1000
                : profile.createdAt
            ).toLocaleString()
          : "-"}
      </p>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
