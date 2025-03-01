import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import MatchesCard from '../components/MatchesCard.jsx';

const Matches = () => {
    const [matches, setMatches] = useState([]);
        
    const getMatchesToDisplay = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error("User not authenticated.");
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch("http://localhost:3000/api/getMatches", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);

            if(response.ok) {
                if(data.message === "Matches found") {
                    setMatches(data.matches);
                }
                else {
                    //no matches found
                    setMatches([]);
                }
            } else {
                console.error("Error retrieving matches:", error);
            }
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    }
    
    //when page is first loaded or reloaded
    useEffect(() => {
        getMatchesToDisplay();
    }, []);

    useEffect(() => {
        console.log(matches);
    }, [matches]);
    
    return (
        <div className="flex flex-col items-center mt-20">
            {matches.length > 0 ? (
                matches.map((match) => (
                    <MatchesCard key={match.id} matchName={match.likedUser} date={match.date} />
                ))
            ) : (
                <p>No matches found.</p>
            )}
        </div>
    );
};

export default Matches;