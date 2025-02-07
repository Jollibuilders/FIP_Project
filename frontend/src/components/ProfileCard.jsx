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

    return (
        !noMoreProfiles ? (
            <div className="flex flex-col justify-center items-center bg-white shadow-md shadow-gray-400 p-6 rounded-lg m-10">
                <h1>{displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].name : "Loading..."}</h1>
                
                <div className="flex flex-row space-x-4 items-center mt-10">
                    <SkipButton onClick={handleSkip} />
                    <LikeButton onClick={handleLike} />
                </div>
            </div>
        ) : (
            <div>No more profiles</div>
        )
    );
};

export default ProfileCard;