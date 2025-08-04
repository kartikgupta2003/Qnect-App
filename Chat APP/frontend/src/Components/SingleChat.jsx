import React, { useState, useEffect } from 'react';
import { ChatState } from '../Context/chatProvider';
import { getSender } from "../Config/ChatLogics.js";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupModal from './miscellaneous/UpdateGroupModal.jsx';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useToast } from "@chakra-ui/toast";
import ScrollableChat from "./ScrollableChat.jsx";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notifications, setNotificatons } = ChatState();
    const [showModal, setShowModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true);
        })
        return () => {
            socket.disconnect();
        }
        setNotificatons(user.notifications);
    }, []);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, { withCredentials: true });
            setLoading(false);
            setMessages(data);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
    }

    const notifHandler = async (newMessageRecieved) => {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        }
        const body = {
            chatId: newMessageRecieved.chat._id,
        }
        try {
            const {data}=await axios.post("/api/notif/add", body, config);
            setNotificatons(data.notifications);
            localStorage.setItem("userInfo", JSON.stringify(data));
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the notification",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])



    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                setNotificatons((prevNotifications) => {
                    const alreadyExists = prevNotifications.some(
                        (notif) => notif._id === newMessageRecieved._id
                    );
                    if (alreadyExists== false) {
                        setFetchAgain((prev) => !prev);
                        return [newMessageRecieved.chat, ...prevNotifications];
                    }
                    else return prevNotifications;
                });
                // add this message's chatId to the notifications field of the user
                notifHandler(newMessageRecieved);
            }
            else {
                setMessages((prevmessages) => [...prevmessages, newMessageRecieved])
            }
        })
    }, []);
    useEffect(()=>{
        setNotificatons(user.notifications);
    } , []);
    // w/o any depenedency app runs after every re-render

    const sendMessage = async (e) => {
        // if(e.key !== 'Enter') return ;
        // console.log("Enter dabaya")

        if (e.key === 'Enter' && newMessage) {
            // socket.emit("stop typing" , selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                    withCredentials: true
                }
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                // actually wo backend data ke sath aur bhi bhut sare fields and headers bhejta hai like status
                // hame usme se kewal data chahiye 

                socket.emit("new message", data);
                setMessages((prevmessages) => [...prevmessages, data]);
                setNewMessage("");

            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
                return;
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

    return (
        <>
            {selectedChat ?
                <>
                    <div
                        className='
            pb-3
            ps-2
            pe-2
            w-100
            d-flex
            align-items-center
            justify-content-between'
                        style={{ fontSize: "29px" }}>
                        <button className='d-flex' type="button" onClick={() => setSelectedChat("")}><i className="fa-solid fa-arrow-left"></i></button>
                        {!selectedChat.isGroupChat ? (<>
                            {getSender(user, selectedChat.users)[0].name}
                            <ProfileModal
                                show={showModal}
                                handleClose={() => setShowModal(false)}
                                user={getSender(user, selectedChat.users)[0]}
                                setShowModal={setShowModal}
                            /></>) : (<>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupModal
                                    showGroupModal={showGroupModal}
                                    setShowGroupModal={setShowGroupModal}
                                    handleClose={() => setShowGroupModal(false)}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>)}

                    </div>
                    <div className="d-flex flex-column 
            p-3
            rounded
            justify-content-end"
                        style={{ backgroundColor: "#E8E8E8", width: "100%", height: "100%", overflowY: "hidden" }}>
                        {loading ? (<p>Loading...</p>) : (
                            <div className='d-flex
                            flex-column
                            '
                                style={{
                                    overflowY: "scroll",
                                    scrollbarWidth: "none"
                                }}>
                                <ScrollableChat
                                    messages={messages} />
                            </div>
                        )}
                        {/* {istyping ? <div>typing...</div> : <></>} */}
                        <Form.Control
                            onKeyDown={sendMessage}
                            className='mt-3'
                            required
                            bg="#E0E0E0"
                            placeholder='Enter a message...'
                            onChange={typingHandler}
                            value={newMessage}>
                            {/* humne yha form tag ka use isliye nhi kiya kyuki hume kuch submit nhi karna hai enter dabane pe  */}
                        </Form.Control>
                    </div>
                </>
                :
                <div className='d-flex align-items-center justify-content-center h-100'>
                    <p className='pb-3'
                        style={{ fontSize: "30px", fontFamily: "Work Sans" }}>
                        Click on a user to start chatting</p></div>}

        </>
    )
}

export default SingleChat;