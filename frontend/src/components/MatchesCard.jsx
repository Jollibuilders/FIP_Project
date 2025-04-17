import React from 'react';
import image from '../assets/test_image.jpg';
import { Link } from 'react-router-dom';

const MatchesCard = ({ matchName, date }) => {
    const formattedDate = date? 
        new Date(date._seconds * 1000).toLocaleDateString("en-US", { 
            month: "long",
            day: "numeric",
        }) 
        : "No date available";
    return (
        <div className="flex flex-row items-center w-1/4 mb-2">
            <img src={image} className="h-20 rounded-full mr-4"/>
            <div className="flex flex-col items-start w-full border-b border-gray-300 py-4">
                <div className="flex flex-row justify-between items-center w-full">
                <Link 
                        to="/profile" 
                        className="font-semibold text-black-600 hover:underline"
                    >
                        {matchName}
                    </Link>
                    <span className="font-medium text-right">{formattedDate}</span>
                    {/* matched date */}
                </div> 
                <p className="text-sm max-w-md text-left pt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
        </div>
    );
};

export default MatchesCard;