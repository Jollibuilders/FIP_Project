import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

const ProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!currentUserUID) {
      setError('User not authenticated.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await updateDoc(doc(db, 'users', currentUserUID), {
        fullName,
        school: school || null,
      });

      setSuccess(true);
      navigate('/home')
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete your profile</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs rounded-md">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                School (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineAcademicCap className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="pl-10 w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors"
                  placeholder="Enter your school"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-md text-sm font-medium transition-colors duration-200 ${
                loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="w-full mt-4 h-12 flex items-center justify-center gap-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;