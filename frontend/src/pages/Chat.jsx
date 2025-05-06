import React, { useState } from 'react';
import Messages from '../components/chat/Messages';
import List from '../components/chat/List';
 
const ChatPage = () => {
    const [chatId, setChatId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);

    return (
        <div className="flex h-screen justify-center items-center" style={{ backgroundColor: '#F6F3EE' }}>
            <div className="flex flex-row w-[95%] h-[90%]">
                <List setChatId={setChatId} setOtherUserId={setOtherUserId}/>
                {chatId ? (
                    <Messages chatId={chatId} otherUserId={otherUserId}/>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full rounded-r-xl p-10 bg-white shadow-md">
                        <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6" style={{ backgroundColor: '#CBB497' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#3D270A] mb-4">Select a conversation</h2>
                        <p className="text-[#3D270A] text-center max-w-md mb-6">
                            Choose a conversation from the sidebar or search for a user to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;