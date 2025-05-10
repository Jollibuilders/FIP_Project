import React from 'react';
import image from '../assets/test_image.jpg';
import { Link } from 'react-router-dom';

const MatchesCard = ({ matchName, date, description, likedUserId }) => {
    const formattedDate = date? 
        new Date(date._seconds * 1000).toLocaleDateString("en-US", { 
            month: "long",
            day: "numeric",
        }) 
        : "No date available";

    return (
        <div className="bg-white border border-gray-200 rounded-lg w-full max-w-2xl mb-4 transition-all duration-200 hover:shadow-sm">
            <div className="flex p-4">
                <div className="flex-shrink-0">
                    <img 
                        src={image} 
                        className="h-16 w-16 rounded-full object-cover border border-gray-100" 
                        alt={`${matchName}'s profile`} 
                    />
                </div>
                
                <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h1 className="text-lg font-medium text-black">{matchName}</h1>
                        <span className="text-sm text-gray-500">
                            {formattedDate}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {description || "No profile description available"}
                    </p>
                    
                    <div className="flex space-x-2">
                        <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200">
                            Message
                        </button>
                        <Link
                            to={`/profile/${likedUserId}`}
                            className="bg-white hover:bg-gray-50 text-black border border-gray-300 px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchesCard;
