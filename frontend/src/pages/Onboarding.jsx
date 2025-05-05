import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import ArrowBack from "../assets/arrow-back.svg";
import OnboardingStep from '../components/OnboardingStep';
import {getCommonQuestions, getJobSeekerQuestions, getRecruiterQuestions} from "../data/OnboardingQuestions.js";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // shared fields
    fullName: '',
    email: '',
    location: '',
    school: '',
    currentJobTitle: '',
    yearsOfExperience: 0,
    keySkills: [],
    aboutMe: '',

    // job seeker fields
    desiredJobTitle: '',
    employmentType: '',
    desiredLocation: '',

    // recruiter fields
    companyName: '',
    companySize: '',
    companyLocation: [],
    companyEmploymentType: [],
    rolesHiringFor: [],
    contactEmail: '',
  });
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
        fetchUserRole();
        fetchUserData();
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
        
        // Pre-fill email if available
        if (userData.email) {
          setFormData(prev => ({
            ...prev,
            email: userData.email
          }));
        }
      } else {
        setError('No user data found.');
        return null;
      }
    } catch (err) {
      setError('Failed to fetch user role. Please try again.');
      console.error('Error fetching user role:', err);
    }
  }

  const fetchUserData = async() => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setFormData(prevState => ({
          ...prevState,
          ...docSnap.data()
        }));
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    }
  };

  // Get questions based on role
  const commonQuestions = getCommonQuestions();
  const roleSpecificQuestions = selectedRole === "Job Seeker" 
    ? getJobSeekerQuestions() 
    : getRecruiterQuestions();
  
  // Combine questions based on role
  const steps = [...commonQuestions, ...roleSpecificQuestions];
  const totalSteps = steps.length;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100);

  const handleInputChange = (key, value) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleMultiSelectChange = (key, option) => {
    setFormData(prevData => {
      const currentSelections = prevData[key] || [];
      if (currentSelections.includes(option)) {
        return { 
          ...prevData, 
          [key]: currentSelections.filter(item => item !== option) 
        };
      } else {
        return { 
          ...prevData, 
          [key]: [...currentSelections, option] 
        };
      }
    });
  };

  const handleTagsChange = (key, value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prevData => ({ ...prevData, [key]: tags }));
  };

  const nextStep = () => {
    const currentQuestion = steps[currentStep];
    
    if (currentQuestion.type !== 'multiselect' && 
        currentQuestion.type !== 'tags' &&
        (!formData[currentQuestion.key] || formData[currentQuestion.key] === '')) {
      setError('Please fill out this field.');
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setError('');
    } else {
      handleSubmit();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!currentUserUID) {
      setError('No authenticated user found.');
      return;
    }

    try {
      setError('');

      await updateDoc(doc(db, 'users', currentUserUID), formData);
      
      navigate('/home');
    } catch(err) {
      setError('Failed to save profile. Please try again.');
      console.error('Error saving profile:', err);
    }
  };

  if (!selectedRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 pt-20 p-4">
      <div className="w-full max-w-md lg:max-w-lg relative p-8 rounded-md">
        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Start</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gray-900 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {currentStep > 0 && (
          <button onClick={previousStep} className="absolute -top-8 left-6">
            <img src={ArrowBack} alt="arrow-back" className="w-10 h-10" />
          </button>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">
            {error}
          </div>
        )}
        
        <OnboardingStep 
          questionData={steps[currentStep]} 
          formData={formData}
          onInputChange={handleInputChange}
          onMultiSelectChange={handleMultiSelectChange}
          onTagsChange={handleTagsChange}
        />
        
        <button
          onClick={nextStep}
          className="w-full mt-20 py-4 bg-gray-900 text-white rounded-full font-semibold"
        >
          {currentStep < totalSteps - 1 ? "Continue" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;