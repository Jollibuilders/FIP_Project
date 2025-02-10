import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import ProfileCard from '../components/ProfileCard';
import NavigationBar from "../components/NavigationBar.jsx";

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <NavigationBar />

            <h1 className="text-4xl font-bold text-center text-gray-800 md:mt-20 mb-4">
                Hi, {user.displayName ? user.displayName : user.email}!
            </h1>

            <h2 className="text-2xl font-bold text-center text-gray-800 mt-8">
                Welcome to Job Connector!
            </h2>
            <p className="text-xl text-center text-gray-800 mt-4 mb-8">
                Swipe. Match. Intern. The easiest way for students and recruiters to connect instantly!
            </p>

            <ProfileCard />

            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

export default Home;
