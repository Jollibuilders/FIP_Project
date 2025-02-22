import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import LikeButton from './LikeButton';
import SkipButton from './SkipButton';
import image from '../assets/test_image.jpg';
import SkillIcon from './SkillIcon.jsx';

const ProfileCard = () => {
    const [displayedProfiles, setDisplayedProfiles] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showMatchToast, setShowMatchToast] = useState(false);
    const [toastProgress, setToastProgress] = useState(100);
    const [moreProfiles, setMoreProfiles] = useState(false);

    const jobStatusColors = {
        "Internship": 'bg-green-300',
        "Full-time": 'bg-indigo-300',
        "Open to anything": 'bg-blue-300',
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
    }
    
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
            console.log(response);

            const data = await response.json();
            if (response.ok) {
                if(data.message === "Match detected") {
                    setShowMatchToast(true);
                    setToastProgress(100);
                    setTimeout(() => setShowMatchToast(false), 3000);
                }
                else if(data.message === "Like recorded") {
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
    }
    
    const getUsersToDisplay = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "test-users"));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDisplayedProfiles(usersList);
            setMoreProfiles(true);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            
        }
    }
    
    //when page is first loaded or reloaded
    useEffect(() => {
        getUsersToDisplay();
        console.log(displayedProfiles);
    }, [])

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
                setMoreProfiles(false);
                return 0;
            });
        }
    }, [showMatchToast]);

    //add grad year
    return (
        moreProfiles ? (
            <div className="flex flex-col w-full items-center justify-center">
                {showMatchToast && (
                    <div className="fixed top-10 bg-green-500 text-white w-auto px-4 py-2 rounded shadow-lg shadow-gray-300 z-20">
                        Match with {displayedProfiles[currentIdx].name}!
                        <button
                            className="ml-2 text-sm text-white font-bold"
                            onClick={() => setShowMatchToast(false)}
                        >
                            ✕
                        </button>
                        <div
                            className="h-1 bg-white rounded mt-2"
                            style={{
                                width: `${toastProgress}%`,
                                transition: "width 0.03s linear",
                            }}
                        />
                    </div>
                )}
                <div className="bg-white shadow-md shadow-gray-300 p-10 rounded-lg m-10 sm:w-full sm:h-auto md:w-1/4 md:h-auto">
                    <div className="flex flex-col text-left justify-star items-start w-full space-x-2">
                        <div className="flex flex-row justify-center items-center">
                            <img src={image} className="h-50 rounded-full mr-8"/>
                            <div className="">
                                <h1 className="font-bold text-2xl">
                                    {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].name : "Loading..."}
                                </h1>
                                <div className="flex space-x-2 mt-1 text-gray-400">
                                    <span className="font-semibold text-sm">
                                        {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].grad : "Loading..."}
                                    </span>
                                    <span className="font-semibold text-sm">
                                        {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].age : "Loading..."}
                                    </span>
                                </div>
                                <div className={`inline-block rounded-md px-3 py-1 text-sm font-semibold mt-6 ${jobStatusColors[displayedProfiles[currentIdx]?.job_status]}`}>
                                    <span className="text-gray-700">
                                        {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].job_status : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap flex-1 items-start">
                            {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].skills.map((item, index) => (
                                <SkillIcon key={index} text={item}/>
                            )) : "Loading..."}
                        </div>
                        <div className="mt-10">
                            <h1 className="font-semibold text-lg mb-2">
                                About Me
                            </h1>
                            <span className="font-[500] text-gray-600">
                                {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].description : "Loading..."}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-row justify-between w-full items-center mt-6">
                        <SkipButton onClick={handleSkip} />
                        <LikeButton onClick={handleLike} />
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col w-full justify-center items-center">
                <div className="flex w-1/4 text-3xl font-bold bg-white shadow-md shadow-gray-300 p-20 rounded-lg m-10 justify-center">
                    <h1>No More Profiles!</h1>
                </div>
                <Link 
                    className="hover:scale-110 transition-transform duration-200 ease-in-out active:scale-95 bg-gray-300 shadow-md shadow-gray-300 px-4 py-2 rounded-lg font-semibold text-sm" 
                    to="/home"
                >
                    Return Home
                </Link>
            </div>
        )
    );
};

export default ProfileCard;