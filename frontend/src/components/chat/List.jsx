import React, { useState, useEffect } from 'react';

const List = () => {
    return (
        <div className='flex flex-col w-1/6 h-full rounded-l-xl p-10' style={{ backgroundColor: '#9E8059'}}>
            <div className='flex w-full h-20 justify-center items-center bg-white rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                <span className='font-bold text-[#3D270A]'>Schedule Coffee Chat</span>
            </div>
        </div>
    );
};

export default List;