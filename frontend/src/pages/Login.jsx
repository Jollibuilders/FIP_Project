import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import fip_logo from "../assets/fip_logo.svg";

import { IoIosClose, IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Initialize the navigate function
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
            
            // Checks ot make sure that a user has a role, if not directs them
            // to the select role page, otherwise directs them to the home page
            const userRef = doc(db, 'users', userCredential.user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, { role: null }, { merge: true});
                navigate('/select-role');
                return;
            }

            const userData = userDoc.data();

            if (userData.role) {
                navigate('/home');
            } else {
                navigate('/select-role');
            }
        } catch (err) {
            setError("Invalid email or password");
            console.error('Error logging in:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative">
                <img 
                    src={fip_logo} 
                    alt="FIP Logo" 
                    className="absolute -top-6 -right-8 w-16 h-16"
                />
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <div className="flex flex-row items-center justify-between mb-4 p-2 px-3 bg-red-100 rounded">
                        <span className="text-red-600 text-sm">{error}</span>
                        <IoIosClose className="text-red-600 text-lg transform hover:scale-135 transition-transform duration-200" onClick={() => setError('')}/>
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="login-email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="login-password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="login-password"
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
                        className="w-full py-2 bg-[#9E8059] text-white rounded hover:bg-[#a08664d5] transition-colors"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
