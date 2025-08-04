import React from 'react';
import { useEffect, useState } from 'react';
import { ChatState } from "../Context/chatProvider.jsx";
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import ChatBox from '../Components/ChatBox.jsx';
import MyChats from '../Components/MyChats.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';




const ChatPage = () => {
    const { user, setUser } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    if(loading || !user || user==null){
        return (
            <p>Loading...</p>
        )
    }
    return (
        <>
            <div style={{ width: "100%" }}>
                {user && user!==null && <SideDrawer />}
                <div className='d-flex justify-content-between' style={{ width: "100%", height: "91.5vh", padding: "10px" }}>
                    {user && user!==null && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                    {user && user!==null && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </div>
            </div>
        </>
    )
}

export default ChatPage;