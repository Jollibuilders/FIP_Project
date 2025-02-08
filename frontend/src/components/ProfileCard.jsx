import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import LikeButton from './LikeButton';
import SkipButton from './SkipButton';
import image from '../assets/test_image.jpg';
import SkillIcon from './SkillIcon.jsx';

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
                <div className="flex flex-row text-left justify-center items-center w-full space-x-2">
                    <img src={image} className="h-50 rounded-full mr-8"/>
                    <div className="">
                        <h1 className="font-bold text-2xl">
                            {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].name : "Loading..."}
                        </h1>
                        <div className="flex space-x-2 mt-1 text-gray-400">
                            <span className="font-semibold text-sm">
                                Undergraduate {/* replace with what they're studying i.e. graduate, undergrad, etc. */}
                            </span>
                            <span className="font-semibold text-sm">
                                {displayedProfiles[currentIdx] ? displayedProfiles[currentIdx].age : "Loading..."}
                            </span>
                        </div>
                        <div className="inline-block bg-blue-300 rounded-md px-3 py-1 text-sm font-semibold mt-6">
                            <span className="text-white">Full time</span>
                        </div>
                    </div>
                </div>
                <SkillIcon text={"hi"}/>
                
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