import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';

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
                
            } else {
                
            }
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    }
    
    //when page is first loaded or reloaded
    useEffect(() => {
        getMatchesToDisplay();
        console.log(matches);
    }, [])
    
    return (
        <div>
            <span>hei</span>
        </div>
    );
};

export default Matches;