import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import MatchesCard from '../components/MatchesCard.jsx';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    const getMatchesToDisplay = async () => {
        setIsLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error("User not authenticated.");
                return;
            }

            const token = await user.getIdToken();
            
            const matchesResponse = await fetch("http://localhost:3000/api/getMatches", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            const matchesData = await matchesResponse.json();
            console.log("Matches data:", matchesData);

            if (!matchesResponse.ok) {
                console.error("Error retrieving matches:", matchesData.error);
                setIsLoading(false);
                return;
            }
            
            if (matchesData.message !== "Matches found" || !matchesData.matches || matchesData.matches.length === 0) {
                // No matches found
                setMatches([]);
                setIsLoading(false);
                return;
            }
            
            // Create an array to hold the enhanced matches with user details
            const enhancedMatches = [];
            
            // Fetch user details for each match
            for (const match of matchesData.matches) {
                try {
                    const userProfileResponse = await fetch(`http://localhost:3000/profiles/${match.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    
                    const userProfileData = await userProfileResponse.json();
                    
                    if (userProfileResponse.ok && userProfileData.user) {
                        enhancedMatches.push({
                            ...match,
                            aboutMe: userProfileData.user.aboutMe || null,
                        });
                    } else {
                        enhancedMatches.push(match);
                    }
                } catch (error) {
                    console.error(`Error fetching profile for user ${match.id}:`, error);
                    enhancedMatches.push(match);
                }
            }
            
            setMatches(enhancedMatches);
            
        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    //when page is first loaded or reloaded
    useEffect(() => {
        getMatchesToDisplay();
    }, []);
    
    return (
        <div className="flex flex-col items-center mt-20">
            {isLoading ? (
                <h1 className="font-semibold text-2xl">Loading Matches...</h1>
            ) : matches.length > 0 ? (
                matches.map((match) => (
                    <MatchesCard 
                        key={match.id} 
                        matchName={match.likedUser} 
                        date={match.date}
                        description={match.aboutMe || "No profile description available"}
                    />
                ))
            ) : (
                <div className="flex flex-col w-full justify-center items-center">
                    <div className="text-3xl w-1/2 font-semibold mt-10 mb-6 border-b border-gray-300 py-2">
                        <h1 className="text-center py-2">No Matches Found!</h1>
                    </div>
                    <div className="flex flex-row space-x-10">
                        <Link 
                            className="hover:scale-110 hover:bg-[#0A0F24]/90 transition-transform duration-200 ease-in-out active:scale-95 bg-[#0A0F24] text-white shadow-md shadow-gray-300 px-4 py-2 rounded-lg font-semibold text-sm" 
                            to="/home"
                        >
                            Return Home
                        </Link>
                        <Link 
                            className="hover:scale-110 hover:bg-[#0A0F24]/90 transition-transform duration-200 ease-in-out active:scale-95 bg-[#0A0F24] text-white shadow-md shadow-gray-300 px-4 py-2 rounded-lg font-semibold text-sm" 
                            to="/match"
                        >
                            Get New Matches
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Matches;