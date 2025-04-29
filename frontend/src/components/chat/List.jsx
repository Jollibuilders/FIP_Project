import React, { useState, useEffect } from 'react';
import MessageCards from '../MessageCards';

const tempList = [
    { id: 1, name: 'John Doe', date: '2023-10-01' },
    { id: 2, name: 'Jane Smith', date: '2023-10-02' },
    { id: 3, name: 'Alice Johnson', date: '2023-10-03' },
    { id: 4, name: 'Bob Brown', date: '2023-10-04' },
    { id: 5, name: 'Bob Brown', date: '2023-10-04' },
    { id: 6, name: 'Bob Brown', date: '2023-10-04' },
];

const List = () => {
    return (
        <div className='flex flex-col w-1/4 h-full rounded-l-xl p-10 max-h-full overflow-y-auto' style={{ backgroundColor: '#9E8059'}}>
            <MessageCards listOfUsers={tempList} />
        </div>
    );
};

export default List;