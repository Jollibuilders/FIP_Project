import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import BasicInfo from "./components/profile_setup/BasicInfo.jsx";
import ProfessionalDetails from "./components/profile_setup/ProfessionalDetails.jsx";
import JobPreferences from "./components/profile_setup/JobPreferences.jsx";
import AboutMe from "./components/profile_setup/AboutMe.jsx";
import RecruiterDetails from "./components/profile_setup/RecruiterDetails.jsx";

const ProfileSetup = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    fullName: '', email: '', location: '', school: '', currentJobTitle: '',
    yearsOfExperience: 0, keySkills: [], aboutMe: '',
    desiredJobTitle: '', employmentType: '', desiredLocation: '', resume: null,
    companyName: '', companySize: '', companyLocation: [], companyEmploymentType: [],
    rolesHiringFor: [], contactEmail: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
        fetchUserRole();
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchUserRole = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('No authenticated user found.');
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setSelectedRole(userDoc.data().role);
      } else {
        setError('No user data found.');
      }
    } catch (err) {
      setError('Failed to fetch user role.');
    }
  };

  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }
    if (currentStep === 1) {
      if (!formData.currentJobTitle.trim()) newErrors.currentJobTitle = "Current Job Title is required";
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required";
      if (formData.keySkills.length === 0) newErrors.keySkills = "At least one skill is required";
    }
    if (selectedRole === "Job Seeker" && currentStep === 2) {
      if (!formData.desiredJobTitle.trim()) newErrors.desiredJobTitle = "Desired Job Title is required";
      if (!formData.employmentType.trim()) newErrors.employmentType = "Employment Type is required";
      if (!formData.desiredLocation.trim()) newErrors.desiredLocation = "Desired Location is required";
    }
    if (selectedRole === "Recruiter" && currentStep === 2) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
      if (!formData.companySize.trim()) newErrors.companySize = "Company Size is required";
      if (formData.rolesHiringFor.length === 0) newErrors.rolesHiringFor = "At least one role is required";
    }
    if (currentStep === 3 && !formData.aboutMe.trim()) {
      newErrors.aboutMe = "About Me is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      setLoading(true);
      setError('');
      await updateDoc(doc(db, 'users', currentUserUID), formData);
      setSuccess(true);
      navigate('/home');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const jobSeekerSteps = [
    <BasicInfo formData={formData} setFormData={setFormData} role={selectedRole} errors={errors} />, 
    <ProfessionalDetails formData={formData} setFormData={setFormData} errors={errors} />, 
    <JobPreferences formData={formData} setFormData={setFormData} errors={errors} />, 
    <AboutMe formData={formData} setFormData={setFormData} role={selectedRole} errors={errors} />
  ];

  const recruiterSteps = [
    <BasicInfo formData={formData} setFormData={setFormData} role={selectedRole} errors={errors} />, 
    <ProfessionalDetails formData={formData} setFormData={setFormData} errors={errors} />, 
    <RecruiterDetails formData={formData} setFormData={setFormData} errors={errors} />, 
    <AboutMe formData={formData} setFormData={setFormData} role={selectedRole} errors={errors} />
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete your profile</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself</p>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">Profile updated successfully!</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedRole === "Job Seeker" ? jobSeekerSteps[currentStep] : recruiterSteps[currentStep]}
            <button type="button" onClick={nextStep} className="px-4 py-2 bg-gray-900 text-white rounded">
              {currentStep < 3 ? "Next" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
