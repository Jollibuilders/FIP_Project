// Filename: ProfileSetup.jsx
import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from './firebase'; 

const ProfileSetup = () => {
  const [fullName, setFullName] = useState(''); 
  const [school, setSchool] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const auth = getAuth(); // Initialize Firebase Auth
  let currentUserUID = null; 

  // Waiting for authentication state changes to get the current user's UID
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserUID = user.uid; // Set the UID of the authenticated user
    }
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)

    // Client-side validation: Ensure Full Name is not empty
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return; 
    }

    try {
      setLoading(true); // Enable loading state
      setError(''); // Clear any previous errors

      // Save user profile data to Firestore under the user's UID
      await setDoc(doc(db, 'users', currentUserUID), {
        fullName, 
        school: school || null, 
      });

      setSuccess(true); 
      setError(''); 
    } catch (err) {
      console.error('Error saving profile:', err); 
      setError('Failed to save profile. Please try again.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Main container for the form */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Title of the form */}
        <h2 className="text-2xl font-bold mb-4">Set Up Your Profile</h2>

        {/* Display error message if there's an error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display success message if the profile is saved successfully */}
        {success && <p className="text-green-500 mb-4">Profile saved successfully!</p>}

        {/* Form for user input */}
        <form onSubmit={handleSubmit}>
          {/* Full Name Input Field */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name (required)
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Update state on input change
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your full name"
            />
          </div>

          {/* School Input Field (Optional) */}
          <div className="mb-6">
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">
              School (optional)
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)} // Update state on input change
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your school"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading} // Disable the button while saving
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save'} {/* Show "Saving..." when loading */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;