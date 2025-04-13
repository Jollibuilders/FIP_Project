import React, {useEffect, useState} from 'react';
import OnboardingStep from '../components/OnboardingStep';
import { useNavigate } from 'react-router-dom';
import {commonQuestions, jobSeekerQuestions, recruiterQuestions} from "../data/OnboardingQuestions.js";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import ArrowBack from "../assets/arrow-back.svg";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({});
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
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

  const specificQuestions = selectedRole === "Job Seeker" ? jobSeekerQuestions : recruiterQuestions;
  const steps = [...commonQuestions, ...specificQuestions];

  const totalSteps = steps.length;

  const handleAnswerSelect = (option) => {
    const stepKey = steps[currentStep].key;
    setAnswers({ ...answers, [stepKey]: option });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {

    if (!currentUserUID) {
      setError('No authenticated user found.');
      return;
    }

    try {
      setError('');

      const updatedFormData = {
        ...formData,
        onboardingAnswers: answers
      }
      setFormData(updatedFormData);

      await updateDoc(doc(db, 'users', currentUserUID), updatedFormData);
      const docRef = doc(db, 'users', currentUserUID);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        console.log('Retrieved data:', userDoc.data());
      } else {
        console.log('No such document!');
      }

      navigate('/home');

    } catch(err) {
      setError('Failed to save answers. Please try again.');
      console.error('Error saving answers:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 pt-20 p-4">
      <div className="w-full max-w-md lg:max-w-lg relative p-8 rounded-md">
        {currentStep > 0 && (
          <button onClick={previousStep} className="absolute -top-8 left-6">
            <img src={ArrowBack} alt="arrow-back" className="w-10 h-10" />
          </button>
        )}
        <OnboardingStep
          questionData={steps[currentStep]}
          onAnswerSelect={handleAnswerSelect}
          currentAnswer={answers[steps[currentStep].key] || ""}
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