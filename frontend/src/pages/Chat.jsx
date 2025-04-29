import React, { useState, useEffect } from 'react';
import Messages from '../components/chat/Messages';
import List from '../components/chat/List';
import Details from '../components/chat/Details';

const ChatPage = () => {
    
    return (
        <div className="flex h-screen justify-center items-center" style={{ backgroundColor: '#F6F3EE' }}>
            <div className="flex flex-row w-[95%] h-[80%]">
                <List/>
                <Messages/>
            </div>
        </div>
    );
};

export default ChatPage;