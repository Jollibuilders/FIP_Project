import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from './firebase';
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import BasicInfo from "./components/profile_setup/BasicInfo.jsx";
import ProfessionalDetails from "./components/profile_setup/ProfessionalDetails.jsx";
import JobPreferences from "./components/profile_setup/JobPreferences.jsx";
import AboutMe from "./components/profile_setup/AboutMe.jsx";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    location: '',
    school: '',
    currentJobTitle: '',
    yearsOfExperience: 0,
    keySkills: [],
    desiredJobTitle: '',
    employmentType: '',
    desiredLocation: '',
    resume: null,
    aboutMe: ''
  })

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

  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  }

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
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
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        location: formData.location,
        school: formData.school,
        currentJobTitle: formData.currentJobTitle,
        yearsOfExperience: formData.yearsOfExperience,
        keySkills: formData.keySkills,
        desiredJobTitle: formData.desiredJobTitle,
        employmentType: formData.employmentType,
        desiredLocation: formData.desiredLocation,
        resume: formData.resume,
        aboutMe: formData.aboutMe
      });

      const docRef = doc(db, 'users', currentUserUID);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        console.log('Retrieved data:', userDoc.data());
      } else {
        console.log('No such document!');
      }

      setSuccess(true);
      navigate('/home')
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <BasicInfo formData={formData} setFormData={setFormData} />,
    <ProfessionalDetails formData={formData} setFormData={setFormData} />,
    <JobPreferences formData={formData} setFormData={setFormData} />,
    <AboutMe formData={formData} setFormData={setFormData} />
  ]

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
            {/* Render the current step */}
            {steps[currentStep]}

            <div className="flex justify-between mt-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={(e) => (nextStep(e))}
                  className="ml-auto px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto px-4 py-2 rounded transition-colors duration-200 ${
                    loading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              )}
            </div>
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