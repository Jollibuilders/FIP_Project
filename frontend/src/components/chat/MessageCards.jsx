import { React, useState, useEffect } from "react";
import { db, auth } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDoc, doc, getDocs } from 'firebase/firestore';
import profile from "../../assets/test_image.jpg";

import { FaCirclePlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const MessageCards = ({ listOfUsers, setChatId, setOtherUserId, setOtherUserName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [matchedUsers, setMatchedUsers] = useState([]);

    const handleOpenSearch = () => {
        setIsModalOpen(true);
        setJustOpened(true);
    }

    const handleCloseSearch = () => {
        setIsModalOpen(false);
        setJustOpened(false);
        setSearchInput("");
        setMatchedUsers([]);
    }

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        setJustOpened(false);

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            console.log(currentUser.uid)

            const userChatsDoc = await getDoc(doc(db, 'userchats', currentUser.uid));
            console.log(userChatsDoc)
            if (!userChatsDoc.exists()) {
                console.log("No userchats found for user.");
            }

            const userChatsData = userChatsDoc.data() || {}; // empty if the user has no chats
            const existingUserIds = Object.values(userChatsData).map(chat => chat.receiverId);
            const matchDocRef = collection(db, 'matches');
            const userMatchDoc = await getDocs(query(matchDocRef, where('__name__', '==', auth.currentUser.uid)));
            console.log(userMatchDoc)
            if (userMatchDoc.empty) {
                setMatchedUsers([]);
                return;
            }
    
            const docData = userMatchDoc.docs[0].data();
            const allMatches = docData.matches || [];
    
            // Filter matches by name
            const filteredMatches = allMatches.filter(match =>
                match.name?.toLowerCase().includes(searchInput.toLowerCase()) && !existingUserIds.includes(match.userId)
            );
            setMatchedUsers(filteredMatches);
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    };

    const handleAddChat = async (toUserId) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch("http://localhost:3000/api/addchat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ toUserId }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Chat added successfully:', data);
                handleCloseSearch();
            } else {
                console.error('Failed to add chat:', data.message);
                alert('Failed to add chat');
            }
        } catch (error) {
            console.error('Error adding chat:', error);
        
        }
    };

    const handleOpenChat = (chatId, otherUserId, name) => {
        setChatId(chatId)
        setOtherUserId(otherUserId)
        setOtherUserName(name)
        console.log(name)
    }

    return (
        <div>
            <button 
                className='flex flex-col w-full h-20 justify-center items-center bg-white rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-6 transform transition-transform duration-200 hover:scale-105 active:scale-95'
                onClick={handleOpenSearch}    
            >
                <span className='font-bold text-lg text-[#3D270A] mb-2'>Send Message</span>
                <FaCirclePlus color="#3D270A" size={20}/>
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#F6F3EE] rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#3D270A]">Start a chat</h2>
                            <FaTimes onClick={handleCloseSearch} className="text-[#3D270A] hover:text-red-500 font-bold text-xl"/>
                        </div>
                        <div className="relative w-full mb-4">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') 
                                        handleSearch();
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D270A]"
                            />
                        </div>
                        <div className="space-y-2">
                            {justOpened ? (
                                null
                            ) : matchedUsers.length === 0 ? (
                                <p className="text-sm text-gray-500">No matches found</p>
                            ) : (
                                matchedUsers.map(user => (
                                <div key={user.userId} className="flex flex-row items-center justify-between p-2 px-4 bg-[#3D270A] rounded">
                                    <p className="font-semibold text-[#F6F3EE]">{user.name}</p>
                                    <FaPlus onClick={() => handleAddChat(user.userId)} className="text-[#F6F3EE] hover:text-red-500 font-bold text-lg"/>
                                </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Already created chats */}
            {listOfUsers && listOfUsers.length > 0 && (
                listOfUsers.map((convo) => {
                    const { chatId, name, lastMessage } = convo;

                    return (
                        <div
                            key={chatId}
                            onClick={() => handleOpenChat(chatId, convo.uid, name)}
                            className='flex flex-row items-center w-full h-20 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 bg-white px-6 transform transition-transform duration-200 hover:scale-105 active:scale-95'
                        >
                            <img src={profile} alt="User Profile" className="w-10 h-10 rounded-full mr-4" />
                            <div className="flex flex-col w-full overflow-hidden whitespace-nowrap">
                                <span className='font-semibold text-[#3D270A] text-lg truncate'>{name}</span>
                                <span className='text-[#3D270A] text-sm truncate'>{lastMessage || 'No messages yet'}</span>
                            </div>
                            
                            {/* Optional: Add timestamp back when available */}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MessageCards;