import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Show a loading indicator while authentication state is being determined.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    // Just in case, if there is no user (this shouldn't happen because of ProtectedRoute)
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-gray-800">
            <h1 className="text-3xl font-bold text-center mb-2">Welcome to Job Connector</h1>
            <h2 className="text-lg text-center text-gray-600 mb-6">
                Swipe. Match. Intern.
            </h2>

            <div className="max-w-xl text-left">
                <h3 className="text-2xl font-bold mb-2">How it works</h3>
                <p className="text-sm mb-3">
                    Job Connector helps you connect with recruiters and students through a swipe-based matching system designed for quick and easy networking. Connections are mutual and non-binding.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <h4 className="font-bold mb-1">Sign-up Period</h4>
                        <p className="text-sm">Set up your profile with personal information, resume, and job preferences.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Swiping Period</h4>
                        <p className="text-sm">Explore profiles and swipe to connect with recruiters or students based on mutual interest.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Matching Period</h4>
                        <p className="text-sm">Contact information is shared between mutual matches, enabling direct communication.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 w-full max-w-sm p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center mx-auto">
                <p className="mb-4 text-base font-medium text-gray-900">
                    You're all set! Start exploring your matches.
                </p>
                <Link
                    to="/match"
                    className="w-1/2 mx-auto block px-4 py-2 bg-[#0A0F24] text-white rounded-md font-semibold hover:bg-[#0A0F24]/90 transition duration-300 ease-in-out"
                >
                    View Matches
                </Link>
            </div>


            <button
                onClick={handleLogout}
                className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

export default Home;
