import React, { useState, useEffect } from 'react';
import LikeButton from './LikeButton';
import SkipButton from './SkipButton';

const ProfileCard = ({ userProfiles }) => {
    return (
        <div className="flex flex-col justify-center items-center bg-white shadow-md shadow-gray-400 p-6 rounded-lg m-10">
            <h1>Profile Name</h1>
            
            <div className="flex flex-row space-x-4 items-center mt-10">
                <SkipButton/>
                <LikeButton/>
            </div>
        </div>
    );
};

export default ProfileCard;