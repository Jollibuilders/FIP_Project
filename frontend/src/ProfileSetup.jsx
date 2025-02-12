// Filename: ProfileSetup.jsx
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { doc, updateDoc } from 'firebase/firestore'; 
import { db } from './firebase'; 

const ProfileSetup = () => {
  const [fullName, setFullName] = useState(''); 
  const [school, setSchool] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [currentUserUID, setCurrentUserUID] = useState(null);

  const auth = getAuth(); // Initialize Firebase Auth

  // Set up the auth state listener once on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation: Ensure Full Name is not empty
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    // Ensure we have a current user UID
    if (!currentUserUID) {
      setError('User not authenticated.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update only the specified fields without overwriting others
      await updateDoc(doc(db, 'users', currentUserUID), {
        fullName, 
        school: school || null, 
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Set Up Your Profile</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Profile updated successfully!</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name (required)
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">
              School (optional)
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your school"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
