import { React, useState, useEffect } from "react";
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { FaCirclePlus } from "react-icons/fa6";


const MessageCards = ({ listOfUsers }) => {
    const [users, setUsers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [matchedUsers, setMatchedUsers] = useState([]);

    const handleOpenSearch = () => {
        setIsModalOpen(true);
    }

    const handleCloseSearch = () => {
        setIsModalOpen(false);
        setSearchInput("");
    }

    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        try {
            const matchDocRef = collection(db, 'matches');
            const userMatchDoc = await getDocs(query(matchDocRef, where('__name__', '==', auth.currentUser.uid)));
    
            if (userMatchDoc.empty) {
                setMatchedUsers([]);
                return;
            }
    
            const docData = userMatchDoc.docs[0].data();
            const allMatches = docData.matches || [];
    
            // Filter matches by name
            const filteredMatches = allMatches.filter(match =>
                match.name?.toLowerCase().includes(searchInput.toLowerCase())
            );
    
            setMatchedUsers(filteredMatches);
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    };

    //gets users they have convo with
    useEffect(() => {
        const fetchUsers = async () => {
            if (!listOfUsers || listOfUsers.length === 0) return;

            const uids = new Set();
            listOfUsers.forEach(convo => {
                (convo.otherParticipants || []).forEach(uid => uids.add(uid));
            });

            const uidArray = Array.from(uids);
            const userChunks = [];

            for (let i = 0; i < uidArray.length; i += 10) {
                userChunks.push(uidArray.slice(i, i + 10));
            }

            const userMap = {};
            for (const chunk of userChunks) {
                const q = query(collection(db, 'users'), where('uid', 'in', chunk));
                const snapshot = await getDocs(q);
                snapshot.forEach(doc => {
                    userMap[doc.data().uid] = doc.data();
                });
            }

            setUsers(userMap);
        };

        fetchUsers();
        console.log(users)
    }, [listOfUsers]);

    return (
        <div>
            <button 
                className='flex flex-col w-full h-20 justify-center items-center bg-white rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-6 transform transition-transform duration-200 hover:scale-105 active:scale-95'
                onClick={handleOpenSearch}    
            >
                <span className='font-bold text-xl text-[#3D270A] mb-2'>Schedule Coffee Chat</span>
                <FaCirclePlus color="#3D270A" size={24}/>
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#3D270A]">Start a chat</h2>
                            <button onClick={handleCloseSearch} className="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full p-2 border rounded mb-4"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-[#3D270A] text-white px-4 py-2 rounded w-full mb-4 hover:bg-[#2a1b06]"
                        >
                            Search
                        </button>
                        <div className="space-y-2">
                            {matchedUsers.length === 0 ? (
                                <p className="text-sm text-gray-500">No matches found</p>
                            ) : (
                                matchedUsers.map(user => (
                                    <div key={user.id} className="p-2 border rounded">
                                        <p className="font-bold text-[#3D270A]">{user.name}</p>
                                        <p className="text-sm text-[#3D270A]">{user.email}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
                        {users && users.length > 0 && (
                users.map((convo, index) => {
                    const { id, participants, lastMessage, timestamp } = convo;
                    const name = userNames[otherParticipants[0]] || 'Loading...';

                    return (
                        <div
                            key={id || index}
                            className='flex flex-col justify-center items-center w-full h-20 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 bg-white'
                        >
                            <span className='font-bold text-[#3D270A]'>{name}</span>
                            <span className='text-[#3D270A]'>{lastMessage || 'No messages yet'}</span>
                            <span className='text-[#3D270A]'>
                                {timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleDateString() : 'No timestamp'}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MessageCards;