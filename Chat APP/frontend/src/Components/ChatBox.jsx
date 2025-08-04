import React from 'react';
import { ChatState } from '../Context/chatProvider';
import SingleChat from './SingleChat';
const ChatBox = ({fetchAgain , setFetchAgain})=>{
    const {selectedChat , user} = ChatState();
    
    return (<>
        <div
    className={`${selectedChat ? "d-flex" : "d-none d-md-flex"}
    align-items-center
    flex-column
    p-3
    bg-white
    rounded
    custom-w-100
    custom-w-md-66`}>
        <SingleChat
        fetchAgain={fetchAgain} 
        setFetchAgain={setFetchAgain}/>
    </div>
    </>)
}

export default ChatBox;