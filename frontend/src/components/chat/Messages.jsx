import React, { useState, useEffect, useRef } from 'react';
import TopUserCard from './TopUserCard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { onSnapshot, doc, arrayUnion, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const Messages = ({ chatId, otherUserId }) => {
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const scrollContainerRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && message.trim() !== '') {
            handleSend();
        }
    };

    const handleSend = async () => {
        if (message === "") return;
        try {
            const conversationRef = doc(db, "conversations", chatId);
            await updateDoc(conversationRef, { 
                messages: arrayUnion({
                    senderId: auth.currentUser.uid,
                    message,
                    sentAt: new Date(),
                })
            })
            
            const userIds = [auth.currentUser.uid, otherUserId];

            userIds.forEach(async (id) => {
                const userConvoRef = doc(db, "userchats", id);
                const userConvoSnap = await getDoc(userConvoRef);
            
                if (userConvoSnap.exists()) {
                    const existingData = userConvoSnap.data();
                    const existingChatData = existingData[chatId] || {};
            
                    await updateDoc(userConvoRef, {
                        [chatId]: {
                            ...existingChatData,
                            lastMessage: message,
                            updatedAt: new Date(),
                        }
                    });
                }
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "conversations", chatId), (res) => {
            setConversation(res.data().messages)
        })

        return () => {
            unSub();
        }
    }, [chatId]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [conversation]);
    
    return (
        <div className='flex justify-center items-center w-full h-full rounded-r-xl p-10' style={{ backgroundColor: '#CBB497'}}>
            <div className='flex flex-col w-full h-full rounded-md py-6 px-8' style={{ backgroundColor: '#F6F3EE' }}>
                <TopUserCard user={"Test user"}/>

                <PerfectScrollbar 
                    containerRef={ref => { scrollContainerRef.current = ref; }} 
                    className="flex flex-1 flex-col w-full border-b-black mb-2" 
                    options={{ wheelSpeed: 0.5, wheelPropagation: false, suppressScrollX: true }}
                >
                {conversation.map((message) => (
                        <div
                            key={message?.sentAt?.toString()}
                            className={`w-full flex ${message.senderId === auth.currentUser.uid ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col ${message.senderId === auth.currentUser.uid ? 'items-end' : 'items-start'}`}>
                                <div
                                    className="max-w-screen-sm h-auto rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 p-4"
                                    style={{ backgroundColor: message.senderId === auth.currentUser.uid ? '#3D270A' : '#CBB497' }}
                                >
                                    <span className={`font-semibold ${message.senderId === auth.currentUser.uid ? 'text-white' : 'text-[#3D270A]'}`}>
                                        {message.message}
                                    </span>
                                </div>
                                <span className="text-xs text-black mt-1 ml-1">
                                    {new Date(message.sentAt.seconds * 1000).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </PerfectScrollbar>

                <div className='flex flex-row justify-between w-full h-[8vh] items-center p-4 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]' style={{ backgroundColor: '#CBB497' }}>
                    <div className='flex flex-row w-full justify-center items-center'>
                        <button className='flex items-center justify-center p-2 mr-8 rounded-full' style={{ backgroundColor: '#F6F3EE' }}>
                            <FaPlus/>
                        </button>
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-md mr-8"
                            placeholder="Message..."
                            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                    </div>
                    <button 
                        className='flex items-center justify-center p-2 w-16 rounded-full'
                        style={{ backgroundColor: '#F6F3EE' }}
                        onClick={handleSend}
                    >
                        <IoSend/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messages;