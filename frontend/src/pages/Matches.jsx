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
        } finally {
            setIsLoading(false);
        }
    }
    
    //when page is first loaded or reloaded
    useEffect(() => {
        getMatchesToDisplay();
    }, []);
    
    return (
        <div className="flex flex-col items-center mt-20">
            {isLoading ? (
                <h1 className="font-semibold text-2xl">Loading Matches...</h1>
            ) : matches.length > 0 ? (
                matches.map((match) => {
                    console.log("match:", match); 
                  
                    return (
                      <MatchesCard 
                        key={match.id} 
                        matchName={match.likedUser} 
                        likedUserId={match.likedUserId} 
                        date={match.date} 
                      />
                    );
                  })
            ) : (
                <div className="flex flex-col w-full justify-center items-center">
                    <div className="text-3xl w-1/8 font-semibold mt-10 mb-6 border-b border-gray-300 py-2">
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