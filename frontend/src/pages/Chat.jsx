import React, { useState, useEffect } from 'react';
import Messages from '../components/chat/Messages';
import List from '../components/chat/List';
import Details from '../components/chat/Details';

const ChatPage = () => {
    
    return (
        <div className="flex flex-row justify-center items-center mt-20 space-x-2">
            <Messages className="border-r-black"/>
            <List/>
            <Details/>
        </div>
    );
};

export default ChatPage;