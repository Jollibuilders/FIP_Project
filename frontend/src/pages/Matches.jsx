import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import MatchesCard from '../components/MatchesCard.jsx';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
        
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

            if (!matchesResponse.ok) {
                console.error("Error retrieving matches:", matchesData.error);
                setIsLoading(false);
                return;
            }
            
            if (matchesData.message !== "Matches found" || !matchesData.matches || matchesData.matches.length === 0) {
                setMatches([]);
                setIsLoading(false);
                return;
            }
            
            const enhancedMatches = [];
            
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
    
    useEffect(() => {
        getMatchesToDisplay();
    }, []);
    
    const filteredMatches = matches.filter(match => 
        match.likedUser.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="min-h-screen bg-white py-6 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">

                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search matches..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : filteredMatches.length > 0 ? (
                    <div className="space-y-4">
                        {filteredMatches.map((match) => (
                            <MatchesCard 
                                key={match.id} 
                                matchName={match.likedUser} 
                                likedUserId={match.id}
                                date={match.date}
                                description={match.aboutMe || "No profile description available"}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-medium text-black mb-2">No Matches Found</h2>
                        <p className="text-gray-500 text-sm mb-6">Start liking profiles to get matches</p>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                            <Link 
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none" 
                                to="/home"
                            >
                                Return Home
                            </Link>
                            <Link 
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none" 
                                to="/match"
                            >
                                Find New Matches
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;