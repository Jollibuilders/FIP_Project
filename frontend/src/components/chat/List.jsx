import React, { useState, useEffect, useRef } from 'react';
import MessageCards from '../MessageCards';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';

const List = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [chatLists, setChatLists] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
      const fetchUsersFromUserChats = async () => {
          const auth = getAuth();
          const currentUser = auth.currentUser;
  
          if (!currentUser) {
              console.error("User not authenticated.");
              return;
          }
  
          try {
              // Get userchats document for current user
              const userChatsDoc = await getDoc(doc(db, 'userchats', currentUser.uid));
              if (!userChatsDoc.exists()) {
                  console.log("No userchats found for user.");
                  return;
              }
  
              const chatData = userChatsDoc.data();
              const receiverIds = Object.values(chatData).map(chat => chat.receiverId);
              const uniqueReceiverIds = [...new Set(receiverIds)];
  
              // Chunk queries if more than 10 users
              const userChunks = [];
              for (let i = 0; i < uniqueReceiverIds.length; i += 10) {
                  userChunks.push(uniqueReceiverIds.slice(i, i + 10));
              }
  
              const userMap = {};
              for (const chunk of userChunks) {
                  const q = query(collection(db, 'users'), where('uid', 'in', chunk));
                  const snapshot = await getDocs(q);
                  snapshot.forEach(doc => {
                      userMap[doc.data().uid] = doc.data();
                  });
              }
  
              setChatLists(userMap);
              console.log(userChatsDoc.data())
              // left off
          } catch (error) {
              console.error("Failed to fetch userchats:", error);
          }
      };
  
      fetchUsersFromUserChats();
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