"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { app, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { updatePassword } from "firebase/auth";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
// Use the provided Myanmar location list.
const LOCATION_OPTIONS = [
  'Kachin', 'Kayah', 'Kayin', 'Chin', 'Mon', 'Rakhine', 'Shan',
  'AyeYaWaddy', 'Bago', 'Magway', 'Tanintharyi', 'Yangon',
  'Mandalay', 'Sagaing', 'NayPyiDaw'
];

export default function AdProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    password: "",
    currentPassword: "",
  });

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

  useEffect(() => {
    if (profile && email) {
      setForm({
        email: email,
        fullName: profile.fullName === "-" ? "" : profile.fullName || "",
        phone: profile.phone === "-" ? "" : profile.phone || "",
        gender: profile.gender === "-" ? "" : profile.gender || "",
        dob: profile.dob === "-" ? "" : profile.dob || "",
        location: profile.location === "-" ? "" : profile.location || "",
        password: "",
        currentPassword: "",
      });
    }
  }, [profile, email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  // Validation function for profile editing, similar to signup
  const validateForm = () => {
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Valid email is required.";
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!/^\+?\d{10,15}$/.test(form.phone.trim())) return "Phone must be a valid number (10-15 digits, may start with +).";
    if (!form.gender.trim()) return "Gender is required.";
    if (!form.dob.trim()) return "Date of birth is required.";
    if (new Date(form.dob) > new Date()) return "Date of birth cannot be in the future.";
    if (!form.location.trim()) return "Location is required.";
    if (showPasswordFields && form.password && form.password.length < 6) return "Password must be at least 6 characters.";
    if (showPasswordFields && !form.currentPassword) return "Current password is required for password change.";
    return null;
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    try {
      if (showPasswordFields && auth.currentUser && form.currentPassword) {
        // Re-authenticate
        const { EmailAuthProvider, reauthenticateWithCredential } = await import("firebase/auth");
        const credential = EmailAuthProvider.credential(form.email, form.currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        if (form.password) {
          await updatePassword(auth.currentUser, form.password);
          setSuccess("Password updated successfully.");
          setEditing(false);
          setShowPasswordFields(false);
          setLoading(false);
          return;
        }
      } else if (showPasswordFields) {
        setError("Current password required to change password.");
        setLoading(false);
        return;
      }
      // Firestore update
      const db = getFirestore(app);
      const docRef = doc(db, "admins", form.email);
      try {
        await updateDoc(docRef, {
          fullName: form.fullName || "-",
          phone: form.phone || "-",
          gender: form.gender || "-",
          dob: form.dob || "-",
          location: form.location || "-",
        });
      } catch (err: any) {
        if (err.code === "not-found" || err.message?.includes("No document to update")) {
          await setDoc(docRef, {
            fullName: form.fullName || "-",
            phone: form.phone || "-",
            gender: form.gender || "-",
            dob: form.dob || "-",
            location: form.location || "-",
            createdAt: new Date(),
          }, { merge: true });
        } else {
          throw err;
        }
      }
      setSuccess("Profile updated successfully.");
      setEditing(false);
      setShowPasswordFields(false);
      // Refetch profile
      if (form.email) {
        const db = getFirestore(app);
        const docRef = doc(db, "admins", form.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    } catch (err: any) {
      setError("Failed to update profile: " + (err.message || err.code));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  // Remove error check so we always show the profile UI
  // if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-blue-200">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">My Admin Profile</h2>
        <div className="mb-6 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-mono text-lg mb-2">
            {email}
          </span>
        </div>
        {editing ? (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-4">
              <input
                name="email"
                value={form.email}
                readOnly
                placeholder="Email"
                type="email"
                className="w-full p-2 border rounded bg-gray-100 text-black cursor-not-allowed"
              />
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded text-black"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 border rounded text-black"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select Gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <input
                name="dob"
                value={form.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                type="date"
                className="w-full p-2 border rounded text-black"
              />
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select Location</option>
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {!showPasswordFields && (
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition mb-2"
                >
                  Change Password
                </button>
              )}
              {showPasswordFields && (
                <>
                  <input
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    type="password"
                    className="w-full p-2 border rounded text-black"
                  />
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="New Password (leave blank to keep current)"
                    type="password"
                    className="w-full p-2 border rounded text-black"
                  />
                </>
              )}
            </div>
            <div className="flex gap-4 mt-6 justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-semibold shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="text-black">{profile.fullName || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Phone:</span>
                <span className="text-black">{profile.phone || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Gender:</span>
                <span className="text-black">{profile.gender || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Date of Birth:</span>
                <span className="text-black">{profile.dob || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Location:</span>
                <span className="text-black">{profile.location || "-"}</span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow"
              >
                Edit
              </button>
            </div>
          </div>
        )}
        {success && <div className="text-green-600 mt-4 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-center font-semibold">{error}</div>}
      </div>
    </div>
  );
}
