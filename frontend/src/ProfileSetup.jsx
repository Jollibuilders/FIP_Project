// Filename: ProfileSetup.jsx
import React, { useState } from 'react';

const ProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validating client-side interaction
    if (!fullName.trim()){
      alert("Full name is required.");
      return;
    }
    console.log('Form submitted:', { fullName, school });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Set Up Your Profile</h2>
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;