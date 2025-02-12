import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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

            navigate('/profile-setup');
        } catch (err) {
            console.error('Error signing up:', err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                        {error}
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
                    <div className="mb-6">
                        <label htmlFor="signup-password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="signup-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
