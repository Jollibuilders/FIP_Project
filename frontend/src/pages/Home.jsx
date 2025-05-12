import React from 'react';
import { Link } from 'react-router-dom';
import fip_logo from "../assets/fip_logo.svg";

const Home = () => {

    return (
        <div className="max-h-screen flex flex-col items-center justify-center bg-white p-4 text-gray-800">
            <img src={fip_logo} alt="FIP Logo" className="h-48 mb-4" />
            <h1 className="text-3xl font-bold text-center mb-2">Welcome to KapeChat</h1>
            <h2 className="text-lg text-center text-gray-600 mb-6">
                Swipe. Match. Intern.
            </h2>

            <div className="max-w-xl text-left">
                <h3 className="text-2xl font-bold mb-2">How it works</h3>
                <p className="text-sm mb-3">
                    KapeChat helps you connect with recruiters and students through a swipe-based matching system designed for quick and easy networking. Connections are mutual and non-binding.
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
                        <h4 className="font-bold mb-1">Network</h4>
                        <p className="text-sm">Direct communication and scheduling coffee events are enabled if messages are accepted.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 w-full max-w-xl p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center mx-auto">
                <p className="mb-4 text-base font-medium text-gray-900">
                    You're all set! Start exploring your matches.
                </p>
                <Link
                    to="/match"
                    className="w-1/3 mx-auto block px-4 py-2 bg-[#0A0F24] text-white rounded-md font-semibold hover:bg-[#0A0F24]/90 transition duration-300 ease-in-out"
                >
                    View Matches
                </Link>
            </div>
        </div>
    );
};

export default Home;
