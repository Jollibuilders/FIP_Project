import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from './firebase';
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
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
    // shared fields
    fullName: '',
    email: '',
    location: '',
    currentJobTitle: '',
    yearsOfExperience: 0,
    keySkills: [],
    aboutMe: '',

    // job seeker fields
    desiredJobTitle: '',
    employmentType: '',
    desiredLocation: '',
    resume: null,
    school: '',

    // recruiter fields
    companyName: '',
    companySize: '',
    companyLocation: '',
    companyLocationType: [],
    companyEmploymentType: [],
    rolesHiringFor: [],
    contactEmail: '',
  })

  //autofills fields
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setFormData(prevState => ({
              ...prevState,
              ...docSnap.data()
            }));
            if (docSnap.data().role) {
              setSelectedRole(docSnap.data().role);
            }
          }
        } catch (err) {
          setError('Failed to fetch profile data.');
          console.error('Error fetching profile data:', err);
        }
      }
    };

    fetchProfileData();
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
        setFormData(prev => ({ ...prev, email: user.email})); // This will autofill the email.
        fetchUserRole();
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchUserRole = async() => {
    const user = auth.currentUser;
    if (!user) {
      setError('No authenticated user found.');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSelectedRole(userData.role);
      } else {
        setError('No user data found.');
        return null;
      }
    } catch (err) {
      setError('Failed to fetch user role. Please try again.');
      console.error('Error fetching user role:', err);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
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
  }

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    if (!currentUserUID) {
      setError('User not authenticated.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const dataToSubmit = {
        fullName: formData.fullName,
        email: formData.email,
        location: formData.location,
        currentJobTitle: formData.currentJobTitle,
        yearsOfExperience: formData.yearsOfExperience,
        keySkills: formData.keySkills,
        aboutMe: formData.aboutMe
      };

      if (selectedRole === 'Job Seeker') {
        dataToSubmit.desiredJobTitle = formData.desiredJobTitle;
        dataToSubmit.employmentType = formData.employmentType;
        dataToSubmit.desiredLocation = formData.desiredLocation;
        dataToSubmit.resume = formData.resume;
        dataToSubmit.school = formData.school;
      } else if (selectedRole === 'Recruiter') {
        dataToSubmit.companyName = formData.companyName;
        dataToSubmit.companySize = formData.companySize;
        dataToSubmit.companyLocation = formData.companyLocation;
        dataToSubmit.companyLocationType = formData.companyLocationType;
        dataToSubmit.companyEmploymentType = formData.companyEmploymentType;
        dataToSubmit.rolesHiringFor = formData.rolesHiringFor;
        dataToSubmit.contactEmail = formData.contactEmail;
      }

      await updateDoc(doc(db, 'users', currentUserUID), dataToSubmit);

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

  const jobSeekerSteps = [
    <BasicInfo formData={formData} setFormData={setFormData} role={selectedRole} errors={errors}/>,
    <ProfessionalDetails formData={formData} setFormData={setFormData} role={selectedRole} />,
    <JobPreferences formData={formData} setFormData={setFormData} />,
    <AboutMe formData={formData} setFormData={setFormData} role={selectedRole} />
  ]

  const recruiterSteps = [
    <BasicInfo formData={formData} setFormData={setFormData} role={selectedRole} />,
    <ProfessionalDetails formData={formData} setFormData={setFormData} role={selectedRole} />,
    <RecruiterDetails formData={formData} setFormData={setFormData} />,
    <AboutMe formData={formData} setFormData={setFormData} role={selectedRole} />
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete your profile</h2>
          <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself</p>

          {errors && Object.keys(errors).length > 0 && (
            <div className="p-3 mb-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md text-center">
              Please enter all highlighted fields
            </div>
          )}  
  
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs rounded-md">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Render the current step */}
            {selectedRole === "Job Seeker" ? jobSeekerSteps[currentStep] : recruiterSteps[currentStep]}

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
              {currentStep < (selectedRole === "Job Seeker" ? jobSeekerSteps.length : recruiterSteps.length) - 1 ? (
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