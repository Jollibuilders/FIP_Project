import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import LikeButton from './LikeButton';
import SkipButton from './SkipButton';

const ProfileCard = ({ userProfiles }) => {
    const [displayedProfiles, setDisplayedProfiles] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [justLoaded, setJustLoaded] = useState(true);
    const [noMoreProfiles, setNoMoreProfiles] = useState(true);

    const handleSkip = () => {
        setCurrentIdx((prevIdx) => {
            if (prevIdx + 1 < displayedProfiles.length) {
                return prevIdx + 1;
            }
            setNoMoreProfiles(true);
            return 0;
        });
        console.log("skip");
    }
    
    const handleLike = () => {
        setCurrentIdx((prevIdx) => {
            if (prevIdx + 1 < displayedProfiles.length) {
                return prevIdx + 1;
            }
            setNoMoreProfiles(true);
            return 0;
        });
        console.log("like");
    }
    
    const getUsersToDisplay = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "test-users"));
            const usersList = querySnapshot.docs.map(doc => doc.data());
            setDisplayedProfiles(usersList);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            
        }
    }
    
    useEffect(() => {
        getUsersToDisplay();
        setNoMoreProfiles(false);
        console.log(displayedProfiles);
    }, [])

    useEffect(() => {
        console.log("reload");
    }, [currentIdx]);
    //might not need

    return (
        !noMoreProfiles ? (
            <div className="flex flex-col justify-center items-center bg-white shadow-md shadow-gray-300 p-10 rounded-lg m-10">
                <div className="flex flex-row text-left w-full space-x-2">
                    <h1 className="font-bold">
                        {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].name : "Loading..."}
                    </h1>
                    <span className="font-semibold">
                        {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].age : "Loading..."}
                    </span>
                </div>
                <div className="mt-10">
                    {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].description : "Loading..."}
                </div>
                
                <div className="flex flex-row justify-between w-full items-center mt-6">
                    <SkipButton onClick={handleSkip} />
                    <LikeButton onClick={handleLike} />
                </div>
            </div>
        ) : (
            <div className="flex text-3xl font-bold bg-white shadow-md shadow-gray-300 p-20 rounded-lg m-10">
                <h1>No More Profiles!</h1>
            </div>
        )
    );
};

export default ProfileCard;