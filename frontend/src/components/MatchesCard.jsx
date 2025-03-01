import React from 'react';

const MatchesCard = ({ matchName, date }) => {
    const formattedDate = date? 
        new Date(date._seconds * 1000).toLocaleDateString() : "No date available";
    return (
        <div className="flex flex-col w-full items-center justify-center mt-20">
            <h3>{matchName}</h3>
            <p>{formattedDate}</p>
        </div>
    );
};

export default MatchesCard;