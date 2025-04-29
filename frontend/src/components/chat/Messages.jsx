import React, { useState, useEffect } from 'react';
import TopUserCard from './TopUserCard';

const Messages = () => {
    
    return (
        <div className='flex flex-col justify-center items-center w-full h-full rounded-r-xl p-10' style={{ backgroundColor: '#CBB497'}}>
            <div className='w-full h-full rounded-md py-6 px-8' style={{ backgroundColor: '#F6F3EE' }}>
                <TopUserCard user={"Test user"}/>
                Message
            </div>
        </div>
    );
};

export default Messages;