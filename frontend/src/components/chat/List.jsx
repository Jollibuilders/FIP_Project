import React, { useState, useEffect, useRef } from 'react';
import MessageCards from './MessageCards';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const List = ({ setChatId, setOtherUserId, setOtherUserName }) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [chatLists, setChatLists] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.error("User not authenticated.");
            return;
        }

        const userChatsRef = doc(db, 'userchats', currentUser.uid);

        const unsubscribe = onSnapshot(userChatsRef, async (userChatsDoc) => {
            if (!userChatsDoc.exists()) {
                console.log("No userchats found for user.");
                return;
            }

            const chatData = userChatsDoc.data();
            const chatListWithNames = [];
            console.log(chatData)

            for (const [chatId, chatInfo] of Object.entries(chatData)) {
                const receiverId = chatInfo.receiverId;
                const userDocRef = doc(db, 'users', receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const lastMessage = chatInfo.lastMessage;
                //need to include onsnapshot here to get the last message
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    chatListWithNames.push({
                        lastMessage: lastMessage,
                        name: userData.fullName || "Unknown",
                        uid: receiverId,
                        chatId: chatId
                    });
                } else {
                    console.warn(`User not found for UID: ${receiverId}`);
                }
            }

            setChatLists(chatListWithNames);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div ref={scrollRef} className={`flex flex-col flex-1 min-w-1/4 h-full rounded-l-xl p-10 max-h-full overflow-y-auto custom-scroll ${
                isScrolling ? '' : 'hide-scrollbar'
            }`} style={{ backgroundColor: '#9E8059'}}>
            <MessageCards listOfUsers={chatLists} setChatId={setChatId} setOtherUserId={setOtherUserId} setOtherUserName={setOtherUserName}/>
        </div>
    );
};

export default List;