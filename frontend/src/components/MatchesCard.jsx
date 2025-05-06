import React from 'react';
import image from '../assets/test_image.jpg';

const MatchesCard = ({ matchName, date, description }) => {
    const formattedDate = date? 
        new Date(date._seconds * 1000).toLocaleDateString("en-US", { 
            month: "long",
            day: "numeric",
        }) 
        : "No date available";
    return (
        <div className="flex flex-row items-center w-[80%] mb-2">
            <img src={image} className="h-20 rounded-full mr-4"/>
            <div className="flex flex-col items-start w-full border-b border-gray-300 py-4">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="font-semibold">{matchName}</h1>
                    <span className="font-medium text-right">{formattedDate}</span>
                    {/* matched date */}
                </div> 
                <p className="text-sm max-w-md text-left pt-2">
                    {description || "No profile description available"}
                </p>
            </div>
        </div>
    );
};

export default MatchesCard;