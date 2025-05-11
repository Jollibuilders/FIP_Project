import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import image from '../assets/test_image.jpg';
import SkillIcon from './SkillIcon.jsx';
import { FaHeart } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";


const ProfileCard = () => {
    const [displayedProfiles, setDisplayedProfiles] = useState([]);
    const [alreadyLikedProfiles, setAlreadyLikedProfiles] = useState([]);
    const [personsRole, setPersonsRole] = useState("");
    const [personsId, setPersonsId] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showMatchToast, setShowMatchToast] = useState(false);
    const [toastProgress, setToastProgress] = useState(100);
    const [moreProfiles, setMoreProfiles] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const jobStatusColors = {
        "Internship": 'bg-green-300 hover:bg-green-400',
        "Full-time": 'bg-indigo-300 hover:bg-indigo-400',
        "Open to anything": 'bg-blue-300 hover:bg-blue-400',
    };

    const handleSkip = () => {
        console.log("You skipped " + displayedProfiles[currentIdx].id);
        setCurrentIdx((prevIdx) => {
            if (prevIdx + 1 < displayedProfiles.length) {
                return prevIdx + 1;
            }
            setMoreProfiles(false);
            return 0;
        });
    };
    
    const handleLike = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch("http://localhost:3000/api/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ toUserId: displayedProfiles[currentIdx].id }), 
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message === "Match detected") {
                    setShowMatchToast(true);
                    setToastProgress(100);
                    setTimeout(() => setShowMatchToast(false), 3000);
                } else if (data.message === "Like recorded") {
                    setCurrentIdx((prevIdx) => {
                        if (prevIdx + 1 < displayedProfiles.length) {
                            return prevIdx + 1;
                        }
                        setMoreProfiles(false);
                        return 0;
                    });
                }
                console.log("Like successful:", data);
            } else {
                console.error("Like failed:", data.message);
            }
        } catch (error) {
            console.error("Error liking user:", error);
        }
    };

    const getCurrentPerson = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        setPersonsId(user.uid);

        if (!user) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch("http://localhost:3000/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message !== "User does not exist") {
                    setPersonsRole(data.role);
                } 
                console.log("Getting user successful:", data);
            } else {
                console.error("Getting user failed:", data.message);
            }
        } catch (error) {
            console.error("Getting user failed:", error);
        }
    }
    
    const getUsersToDisplay = async () => {
        setIsLoading(true);
        await getCurrentPerson();
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersList = querySnapshot.docs.filter(doc => doc.id !== personsId && doc.data().role !== personsRole)
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })
            );
            console.log(usersList);

            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error("User not authenticated.");
                setIsLoading(false);
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch("http://localhost:3000/api/getLikes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                const likedUserIds = data.likes;
                const filteredUsers = usersList.filter(user => !likedUserIds.includes(user.id));
                console.log(filteredUsers);

                setAlreadyLikedProfiles(likedUserIds);
                setDisplayedProfiles(filteredUsers);
                setMoreProfiles(filteredUsers.length > 0);
            } else {
                setAlreadyLikedProfiles([]);
                setDisplayedProfiles([]);
                setMoreProfiles(false);
            }
        } catch (error) {
            console.error("Error fetching profiles:", error);
            setMoreProfiles(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        getCurrentPerson();
    }, []);

    useEffect(() => {
        if (personsId && personsRole) {
            getUsersToDisplay();
        }
    }, [personsId, personsRole])

    useEffect(() => {
        if (showMatchToast) {
            const interval = setInterval(() => {
                setToastProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 30); 
            return () => clearInterval(interval);
        }
        if (!showMatchToast) {
            setCurrentIdx((prevIdx) => {
                if (prevIdx + 1 < displayedProfiles.length) {
                    return prevIdx + 1;
                }
                setMoreProfiles(true);
                return 0;
            });
        }
    }, [showMatchToast]);

    return (
        isLoading ? (
            <div className="flex flex-col w-full items-center justify-center">
                <div className="bg-white shadow-lg p-8 rounded-lg">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-t-black border-gray-200 rounded-full animate-spin mb-4"></div>
                        <h1 className="font-semibold text-xl">Loading Profiles...</h1>
                    </div>
                </div>
            </div>
        ) : moreProfiles ? (
            <div className="flex flex-col w-full items-center justify-center">
                {showMatchToast && (
                    <div className="fixed top-6 inset-x-0 mx-auto max-w-sm z-50">
                        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
                            <span className="font-semibold flex-grow">Match with {displayedProfiles[currentIdx].fullName}!</span>
                            <button
                                className="ml-2 text-white focus:outline-none"
                                onClick={() => setShowMatchToast(false)}
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-50 rounded-b-lg" style={{ width: `${toastProgress}%` }}></div>
                        </div>
                    </div>
                )}
                <div className="bg-white shadow-lg p-8 rounded-lg m-6 max-w-md w-full transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-col space-y-6">
                        {/* Profile counter */}
                        <div className="self-end bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {currentIdx + 1} / {displayedProfiles.length}
                        </div>
                        
                        {/* Profile header */}
                        <div className="flex items-start space-x-4">
                            <img src={image} className="h-20 w-20 rounded-full object-cover shadow-md" alt="Profile" />
                            <div className="flex-1">
                                <h1 className="font-bold text-xl text-gray-900">
                                    {displayedProfiles[currentIdx]?.fullName || "Anonymous User"}
                                </h1>
                                { /* Commented out grad section but can add in future
                                <div className="flex flex-wrap items-center mt-1 text-gray-500 text-sm">
                                    {displayedProfiles[currentIdx]?.grad ? (
                                        <span className="font-medium">
                                            {displayedProfiles[currentIdx].grad}
                                        </span>
                                    ) : null}
                                    {displayedProfiles[currentIdx]?.grad && displayedProfiles[currentIdx]?.age && (
                                        <span className="mx-1">•</span>
                                    )}
                                    {displayedProfiles[currentIdx]?.age ? (
                                        <span className="">
                                            {displayedProfiles[currentIdx].age} years
                                        </span>
                                    ) : null}
                                </div> */ }
                                <span className="text-gray-400 text-sm italic">
                                    {displayedProfiles[currentIdx]?.school || "No school listed"}
                                </span>
                                {displayedProfiles[currentIdx]?.employmentType ? (
                                    <div className="mt-2">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-gray-700 transition-colors ${jobStatusColors[displayedProfiles[currentIdx].employmentType] || 'bg-gray-200'}`}>
                                            {displayedProfiles[currentIdx].employmentType}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Skills section */}
                        {displayedProfiles[currentIdx]?.keySkills && displayedProfiles[currentIdx].keySkills.length > 0 ? (
                            <div className="mt-4">
                                <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Skills</h2>
                                <div className="flex flex-wrap -mx-1">
                                    {displayedProfiles[currentIdx].keySkills.map((item, index) => (
                                        <SkillIcon key={index} text={item}/>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Skills</h2>
                                <p className="text-gray-400 text-sm italic">No skills listed</p>
                            </div>
                        )}

                        {/* About section */}
                        <div className="mt-4">
                            <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">About Me</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {displayedProfiles[currentIdx]?.aboutMe || 
                                 <span className="text-gray-400 italic">This user hasn't added an about section yet.</span>}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-row items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <IoClose 
                                className="w-8 h-8 text-black hover:text-red-300 hover:scale-140 transition-transform duration-200 ease-in-out active:scale-95" 
                                onClick={handleLike}
                            />
                            <FaHeart 
                                className="w-6 h-6 text-black hover:text-red-500 hover:scale-140 transition-transform duration-200 ease-in-out active:scale-95" 
                                onClick={handleLike}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col w-full items-center justify-center">
                <div className="bg-white shadow-lg p-10 rounded-lg text-center max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-3">No More Profiles</h1>
                        <p className="text-gray-600 mb-6">We've run out of profiles to show you. Check back later!</p>
                        <Link 
                            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm" 
                            to="/home"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProfileCard;