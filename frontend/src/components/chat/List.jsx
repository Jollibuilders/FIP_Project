import React, { useState, useEffect, useRef } from 'react';
import MessageCards from '../MessageCards';

const tempList = [
    { id: 1, name: 'John Doe', date: '2023-10-01' },
    { id: 2, name: 'Jane Smith', date: '2023-10-02' },
    { id: 3, name: 'Alice Johnson', date: '2023-10-03' },
    { id: 4, name: 'Bob Brown', date: '2023-10-04' },
    { id: 5, name: 'Bob Brown', date: '2023-10-04' },
    { id: 6, name: 'Bob Brown', date: '2023-10-04' },
    { id: 7, name: 'Bob Brown', date: '2023-10-04' },
    { id: 8, name: 'Bob Brown', date: '2023-10-04' },
    { id: 9, name: 'Bob Brown', date: '2023-10-04' },
    { id: 10, name: 'Bob Brown', date: '2023-10-04' },
];

const List = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef(null);
    let scrollTimeout = null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 500); // Hide scrollbar 500ms after scrolling stops
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, []);

    return (
        <div ref={scrollRef} className={`flex flex-col w-1/4 h-full rounded-l-xl p-10 max-h-full overflow-y-auto custom-scroll ${
                isScrolling ? '' : 'hide-scrollbar'
            }`} style={{ backgroundColor: '#9E8059'}}>
            <MessageCards listOfUsers={tempList} />
        </div>
    );
};

export default List;