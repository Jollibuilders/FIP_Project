import React, { useState, useEffect, useRef } from 'react';
import TopUserCard from './TopUserCard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const fillerMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const messages = [
    { id: 1, own: true, message: fillerMessage, time: "1 min ago"},
    { id: 2, own: false, message: fillerMessage, time: "1 min ago"},
    { id: 3, own: true, message: fillerMessage, time: "1 min ago"},
    { id: 4, own: false, message: fillerMessage, time: "1 min ago"},
    { id: 5, own: true, message: fillerMessage, time: "1 min ago"},
]

const Messages = ({ chatId }) => {
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState();
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "conversations", chatId), (res) => {
            setConversation(res.data())
        })

        return () => {
            unSub();
        }
    }, [chatId]);

    console.log(chatId);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, []);
    
    return (
        <div className='flex justify-center items-center w-full h-full rounded-r-xl p-10' style={{ backgroundColor: '#CBB497'}}>
            <div className='flex flex-col w-full h-full rounded-md py-6 px-8' style={{ backgroundColor: '#F6F3EE' }}>
                <TopUserCard user={"Test user"}/>

                <PerfectScrollbar 
                    containerRef={ref => { scrollContainerRef.current = ref; }} 
                    className="flex flex-1 flex-col w-full border-b-black mb-2" 
                    options={{ wheelSpeed: 0.5, wheelPropagation: false, suppressScrollX: true }}
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`w-full flex ${message.own ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col ${message.own ? 'items-end' : 'items-start'}`}>
                                <div
                                    className="max-w-[60%] h-auto rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 p-4"
                                    style={{ backgroundColor: message.own ? '#3D270A' : '#CBB497' }}
                                >
                                    <span className={`font-semibold ${message.own ? 'text-white' : 'text-[#3D270A]'}`}>
                                        {message.message}
                                    </span>
                                </div>
                                <span className="text-xs text-black mt-1 ml-1">{message.time}</span>
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
                        />
                    </div>
                    <button className='flex items-center justify-center p-2 w-16 rounded-full' style={{ backgroundColor: '#F6F3EE' }}>
                        <IoSend/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messages;