import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'

const SelectRole = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setError('');
    }

    // Function to save the selected role
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
            // Save role to Firestore under the user's document
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { role: selectedRole }, { merge: true});
            
            // Redirect user to the home page after saving role
            navigate('/home');
        } catch (err) {
            setError('Failed to save role. Please try again.');
            console.error('Error saving role:', err);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                        {error}
                    </div>
                )}

                {/* Role selection buttons */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => handleRoleSelect('Job Seeker')}
                        className={`w-full py-2 rounded text-white transition-colors ${
                            selectedRole === 'Job Seeker' ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                    >
                        Job Seeker
                    </button>
                    
                    <button
                        onClick={() => handleRoleSelect('Recruiter')}
                        className={`w-full py-2 rounded text-white transition-colors ${
                            selectedRole === 'Recruiter' ? 'bg-green-600' : 'bg-green-400'
                        }`}
                    >
                        Recruiter
                    </button>
                </div>

                {/* Continue button */}
                <button
                    onClick={handleSubmit}
                    disabled={!selectedRole} // Disable if no role is selected
                    className={`w-full py-2 mt-6 rounded transition-colors ${
                        selectedRole ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SelectRole;
