import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import LikeButton from './LikeButton';
import SkipButton from './SkipButton';
import image from '../assets/test_image.jpg';
import SkillIcon from './SkillIcon.jsx';

const ProfileCard = () => {
    const [displayedProfiles, setDisplayedProfiles] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [noMoreProfiles, setNoMoreProfiles] = useState(true);

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
            setNoMoreProfiles(true);
            return 0;
        });
    }
    
    const handleLike = () => {
        console.log("You liked " + displayedProfiles[currentIdx].id);
        setCurrentIdx((prevIdx) => {
            if (prevIdx + 1 < displayedProfiles.length) {
                return prevIdx + 1;
            }
            setNoMoreProfiles(true);
            return 0;
        });
    }
    
    const getUsersToDisplay = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "test-users"));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
        console.log(displayedProfiles[currentIdx]?.job_status);
    }, [currentIdx]);
    //might not need

    //add grad year
    return (
        !noMoreProfiles ? (
            <div className="flex flex-col justify-center items-center bg-white shadow-md shadow-gray-300 p-10 rounded-lg m-10 sm:w-full sm:h-auto md:w-1/4 md:h-auto">
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
        ) : (
            <div className="flex w-1/4 text-3xl font-bold bg-white shadow-md shadow-gray-300 p-20 rounded-lg m-10 justify-center">
                <h1>No More Profiles!</h1>
            </div>
        )
    );
};

export default ProfileCard;