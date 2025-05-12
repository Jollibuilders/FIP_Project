import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import fip_logo from "../assets/fip_logo.svg";

import { IoIosClose, IoMdEye, IoMdEyeOff } from "react-icons/io";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create a new user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed up:', user);

            // Create a new document in Firestore in the "users" collection
            // using the user's UID as the document ID
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: null, // default role is null until they select one
                createdAt: serverTimestamp(),
            });

            setEmail('');
            setPassword('');
            setError('');

            navigate('/select-role');
        } catch (err) {
            if(err.code === 'auth/email-already-in-use') {
                setError('Email already in use. Please sign-in or try another one.');
            } else if(err.code === 'auth/invalid-email') {
                setError('Invalid email address. Please enter a valid email.');
            } else if(err.code === 'auth/weak-password') {
                setError('Weak password. Please enter a stronger password.');
            } else {
                setError(err.message);
            }
            console.error('Error signing up:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative">
                <img 
                    src={fip_logo} 
                    alt="FIP Logo" 
                    className="absolute -top-6 -left-8 w-16 h-16"
                />
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && (
                    <div className="flex flex-row items-center justify-between mb-4 p-2 px-3 bg-red-100 rounded">
                        <span className="text-red-600 text-sm">{error}</span>
                        <IoIosClose className="text-red-600 text-lg transform hover:scale-135 transition-transform duration-200" onClick={() => setError('')}/>
                    </div>
                )}
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="signup-email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="signup-email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="signup-password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="signup-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <div
                            className="absolute right-3 top-[40px] text-xl text-gray-600 cursor-pointer"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#3D270A] text-white rounded hover:bg-[#3d270ac1] transition-colors"
                    >
                        Create Account
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
