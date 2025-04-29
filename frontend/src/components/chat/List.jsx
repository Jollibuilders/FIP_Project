import React, { useState, useEffect, useRef } from 'react';
import MessageCards from '../MessageCards';
import { db, auth } from '../../firebase';
import { onSnapshot, doc, collection, query, where } from 'firebase/firestore';

const List = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [chatLists, setChatLists] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const user = auth.currentUser;
    
        if (user) {
          const conversationsRef = collection(db, 'conversations');
    
          const q = query(conversationsRef, where('participants', 'array-contains', user.uid));
    
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(docSnap => {
              const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    otherParticipants: data.participants.filter(uid => uid !== user.uid)
                };
            });
    
            setChatLists(conversations);
          }, (error) => {
            console.error("Failed to fetch conversations:", error.message);
          });
    
          return () => unsubscribe();
        }
      }, []);

    return (
        <div ref={scrollRef} className={`flex flex-col w-1/4 h-full rounded-l-xl p-10 max-h-full overflow-y-auto custom-scroll ${
                isScrolling ? '' : 'hide-scrollbar'
            }`} style={{ backgroundColor: '#9E8059'}}>
            <MessageCards listOfUsers={chatLists} />
        </div>
    );
};

export default List;