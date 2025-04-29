import { React, useState, useEffect } from "react";
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MessageCards = ({ listOfUsers }) => {
    const [users, setUsers] = useState({});
    
    useEffect(() => {
        const fetchUsers = async () => {
            if (!listOfUsers || listOfUsers.length === 0) return;

            const uids = new Set();
            listOfUsers.forEach(convo => {
                (convo.otherParticipants || []).forEach(uid => uids.add(uid));
            });

            const uidArray = Array.from(uids);
            const userChunks = [];

            for (let i = 0; i < uidArray.length; i += 10) {
                userChunks.push(uidArray.slice(i, i + 10));
            }

            const userMap = {};
            for (const chunk of userChunks) {
                const q = query(collection(db, 'users'), where('uid', 'in', chunk));
                const snapshot = await getDocs(q);
                snapshot.forEach(doc => {
                    userMap[doc.data().uid] = doc.data();
                });
            }

            setUsers(userMap);
        };

        fetchUsers();
        console.log(users)
    }, [listOfUsers]);

    return (
        <div>
            <div className='flex w-full h-20 justify-center items-center bg-white rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-6'>
                <span className='font-bold text-[#3D270A]'>Schedule Coffee Chat</span>
            </div>
            {users && users.length > 0 && (
                users.map((convo, index) => {
                    const { id, participants, lastMessage, timestamp } = convo;
                    const name = userNames[otherParticipants[0]] || 'Loading...';

                    return (
                        <div
                            key={id || index}
                            className='flex flex-col justify-center items-center w-full h-20 rounded-md shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 bg-white'
                        >
                            <span className='font-bold text-[#3D270A]'>{name}</span>
                            <span className='text-[#3D270A]'>{lastMessage || 'No messages yet'}</span>
                            <span className='text-[#3D270A]'>
                                {timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleDateString() : 'No timestamp'}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MessageCards;