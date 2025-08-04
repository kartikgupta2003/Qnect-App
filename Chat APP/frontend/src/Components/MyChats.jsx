import React, { useState, useEffect } from 'react';
import { ChatState } from "../Context/chatProvider"
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatLoading from "./chatLoading";
import { getSender } from "../Config/ChatLogics.js";
import UserListItem from './UserAvatar/UserListItem';
import UserBadgeItem from "./UserAvatar/UserBadgeItem.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const [showModal, setShowModal] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, setUser, selectedChat, setSelectedChat, chats, setChats ,notifications , setNotificatons} = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const { data } = await axios.get("/api/chat", { withCredentials: true });
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured !",
                desciption: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            return;
        }
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearch("");
            return;
        }

        try {
            setLoading(true)
            const { data } = await axios.get(`/api/user?search=${query}`, { withCredentials: true })
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the seach results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
        try {
            const to_send = { users: selectedUsers, name: groupChatName };
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
                withCredentials: true
            }
            const { data } = await axios.post("/api/chat/group", to_send, config);
            setChats([data, ...chats]);
            setShowModal(false);
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        } catch (error) {
            toast({
                title: "Failed to create a group!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
    }

    const handleDelete = (user) => {
        setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
    }

    const handleGroup = (user) => {
        if (selectedUsers.includes(u => u._id === user._id)) {
            toast({
                title: "User already added !",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            return;
        }
        else {
            setSelectedUsers([...selectedUsers, user]);
        }
    }
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        setNotificatons(user.notifications);
    }, [fetchAgain])

    
    return (<>
            <div
                className={`${selectedChat ? 'd-none d-md-flex' : 'd-flex'
                    } flex-column align-items-center bg-white p-3 rounded border col-12 col-md-4`}
            >
                {/* Header Section */}
                <div className='d-flex justify-content-between align-items-center pb-3 ps-3 pe-3'
                    style={{ fontFamily: "Work Sans", width: "100%" }}>My Chats
                    <button className='d-flex justify-content-center align-items-center btn btn-light' type="button"
                        onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-plus"></i>
                        New Group Chat</button>
                </div>
                <div className='d-flex flex-column p-3 rounded-4'
                    style={{ overflowY: "auto", backgroundColor: "#F8F8F8", width: "100%", height: "100%" }}>
                    {chats ? (
                        <div className='d-flex flex-column justify-content-center align-items-center'
                        >
                            {(chats) ? (
                                chats.map((chat) => {
                                    return (
                                        <div
                                            key={chat._id}
                                            onClick={() => setSelectedChat(chat)}
                                            className={`p-2 px-3 rounded mb-2 
                                ${selectedChat === chat ? 'bg-info text-white' : 'bg-light text-dark'}`}
                                            style={{ cursor: "pointer", width: "100%" }}
                                        >
                                            {(!chat.isGroupChat) ? (getSender(loggedUser, chat.users)[0].name) : (chat.chatName)}
                                        </div>
                                    )
                                })
                            ) : (<></>)}
                        </div>
                    ) : (<ChatLoading />)} </div>
                <GroupChatModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    loggedUser={loggedUser} setLoggedUser={setLoggedUser} groupChatName={groupChatName}
                    setGroupChatName={setGroupChatName} selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers} search={search}
                    setSearch={setSearch} searchResult={searchResult} setSearchResult={setSearchResult}
                    loading={loading} setLoading={setLoading}
                    handleSearch={handleSearch}
                    handleDelete={handleDelete}
                    handleSubmit={handleSubmit}
                    handleGroup={handleGroup}
                />
            </div>
    </>
    )
}

export default MyChats;