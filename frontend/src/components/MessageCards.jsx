import React from "react";

const MessageCards = ({ listOfUsers }) => {
    return (
        <div>
            <div className='flex w-full h-20 justify-center items-center bg-white rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-6'>
                <span className='font-bold text-[#3D270A]'>Schedule Coffee Chat</span>
            </div>
            {listOfUsers && listOfUsers.length > 0 && (
                listOfUsers.map((user) => (
                    <div key={user.id} className='flex flex-col justify-center items-center w-full h-20 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 bg-white'>
                        <span className='font-bold text-[#3D270A]'>{user.name}</span>
                        <span className='text-[#3D270A]'>{user.date}</span>
                    </div>
                ))
            )}
        </div>
    );
};

export default MessageCards;