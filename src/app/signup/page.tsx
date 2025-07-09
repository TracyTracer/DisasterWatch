'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string}>({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);

  const locations = [
    'Kachin', 'Kayah', 'Kayin', 'Chin', 'Mon', 'Rakhine', 'Shan',
    'AyeYaWaddy', 'Bago', 'Magway', 'Tanintharyi', 'Yangon',
    'Mandalay', 'Sagaing', 'NayPyiDaw'
  ];

  const genders = ['Male', 'Female', 'Other'];

  const validate = () => {
    const newErrors: {email?: string; password?: string; confirmPassword?: string} = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)) {
      newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert('You must agree to the terms and privacy policy.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add user info to Firestore 'user' collection
      await addDoc(collection(firestore, 'user'), {
        uid: userCredential.user.uid,
        email,
        fullName,
        phone,
        gender,
        dob,
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

  // Clear error for a field when user edits it
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
  };

  // Update error clearing for all fields
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value);
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value);
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLocation(e.target.value);

  // Revalidate on every field change and update button state
  const revalidate = () => {
    const newErrors: {email?: string; password?: string; confirmPassword?: string} = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)) {
      newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Revalidate on every field change using useEffect
  React.useEffect(() => {
    revalidate();
  }, [fullName, phone, gender, dob, location, email, password, confirmPassword]);

  // Only set canProceed if all fields are filled and validate() returns true
  React.useEffect(() => {
    const allFilled = fullName && phone && gender && dob && location && email && password && confirmPassword;
    setCanProceed(!!allFilled && validate());
  }, [fullName, phone, gender, dob, location, email, password, confirmPassword]);

  // Helper for missing fields warning
  const missingFields = () => {
    const fields = [];
    if (!fullName) fields.push('Full Name');
    if (!phone) fields.push('Phone Number');
    if (!gender) fields.push('Gender');
    if (!dob) fields.push('Date of Birth');
    if (!location) fields.push('Location');
    if (!email) fields.push('Email');
    if (!password) fields.push('Password');
    if (!confirmPassword) fields.push('Confirm Password');
    return fields;
  };

  return (
    <div className="p-4 text-black text-lg">
      {step === 1 ? (
        <form onSubmit={handleNext}>
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => { handleFullNameChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => { handlePhoneChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          <select
            value={gender}
            onChange={e => { handleGenderChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={e => { handleDobChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { handleEmailChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          {errors.email && <div className="text-red-500 text-sm mb-2">{errors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { handlePasswordChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          {errors.password && <div className="text-red-500 text-sm mb-2">{errors.password}</div>}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => { handleConfirmPasswordChange(e); revalidate(); }}
            className="block mb-2 p-2 border rounded w-full text-black text-lg"
            required
          />
          {errors.confirmPassword && <div className="text-red-500 text-sm mb-2">{errors.confirmPassword}</div>}
          <select
            value={location}
            onChange={e => { handleLocationChange(e); revalidate(); }}
            className="block mb-4 p-2 border rounded w-full text-black text-lg"
            required
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-lg ${canProceed ? 'bg-green-500 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}
            disabled={!canProceed}
          >
            Next
          </button>
          {((!email || !password || !confirmPassword || Object.keys(errors).length > 0) || missingFields().length > 0) && (
            <div className="text-yellow-600 text-sm mt-2">
              {missingFields().length > 0
                ? `Please fill: ${missingFields().join(', ')}`
                : 'Please enter a valid email and password (at least 8 characters, uppercase, lowercase, number, special character, passwords must match).'}
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <h2 className="text-2xl font-bold mb-4">User Agreement</h2>
          <div className="mb-4 p-3 border rounded bg-gray-50 text-lg max-h-60 overflow-y-auto text-black">
            <p>
              By signing up, you agree to the following:
              <ul className="list-disc pl-5 mt-2">
                <li>Your information will be used to provide disaster-related services and notifications.</li>
                <li>You consent to receive important alerts and updates via email or phone.</li>
                <li>Your data will be stored securely and not shared with third parties except as required by law.</li>
                <li>You are responsible for keeping your login credentials confidential.</li>
                <li>Misuse of the platform may result in account suspension or removal.</li>
                <li>For more details, please review our <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a>.</li>
              </ul>
            </p>
          </div>
          <label className="flex items-center mb-4 text-black text-lg">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
              required
            />
            I agree to the <a href="#" className="underline ml-1">terms and privacy policy</a>.
          </label>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-lg ${agree ? 'bg-green-500 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}
            disabled={!agree}
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
}
