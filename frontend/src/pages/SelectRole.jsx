import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { HiUser, HiBriefcase } from 'react-icons/hi';

const SelectRole = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setError('');
    }

    const handleSubmit = async () => {
        if (!selectedRole) {
            setError('Please select a role before continuing.');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError('No authenticated user found.');
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { role: selectedRole }, { merge: true});
            navigate('/profile-setup');
        } catch (err) {
            setError('Failed to save role. Please try again.');
            console.error('Error saving role:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Select your role</h2>
                    <p className="text-sm text-gray-500 mb-6">Choose how you'll use the platform</p>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => handleRoleSelect('Job Seeker')}
                            className={`w-full h-12 flex items-center px-4 rounded-md border transition-all duration-200 ${
                                selectedRole === 'Job Seeker'
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <HiUser className={`w-4 h-4 ${
                                selectedRole === 'Job Seeker' ? 'text-white' : 'text-gray-400'
                            }`} />
                            <span className="ml-3 text-sm font-medium">Job Seeker</span>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('Recruiter')}
                            className={`w-full h-12 flex items-center px-4 rounded-md border transition-all duration-200 ${
                                selectedRole === 'Recruiter'
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <HiBriefcase className={`w-4 h-4 ${
                                selectedRole === 'Recruiter' ? 'text-white' : 'text-gray-400'
                            }`} />
                            <span className="ml-3 text-sm font-medium">Recruiter</span>
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedRole}
                        className={`w-full mt-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                            selectedRole
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;