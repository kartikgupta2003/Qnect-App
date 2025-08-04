import React, { useState, useEffect } from 'react';
import { Tooltip, Avatar } from '@chakra-ui/react';
import { ChatState } from "../../Context/chatProvider.jsx";
// current directory se bahar niklo (miscallaneous) fir fir current directory se bahar niklo (Components)
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useToast } from "@chakra-ui/toast";
import ChatLoading from '../chatLoading.jsx';
import UserListItem from '../UserAvatar/UserListItem.jsx';
import * as bootstrap from 'bootstrap';
import { getSender } from "../../Config/ChatLogics.js";

const SideDrawer = () => {
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setUser, setSelectedChat, chats, setChats, notifications, setNotificatons } = ChatState();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        // Get existing instance of the modal
        const modalEl = document.getElementById('profileModal');
        const existingModal = bootstrap.Modal.getInstance(modalEl);

        if (existingModal) {
            existingModal.hide();
        }

        // Also remove any leftover backdrops
        document.body.classList.remove("modal-open");
        const backdrops = document.querySelectorAll(".modal-backdrop");
        backdrops.forEach((el) => el.remove());
        localStorage.removeItem("userInfo");
        await axios.post("/api/user/logout", {}, { withCredentials: true });
        // Even if it might technically work in some setups, using GET for logout violates best practices.
        setUser(null);
        setSelectedChat(null);
        setChats([]);
        setNotificatons([]);
        navigate("/");
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user?search=${search}`, { withCredentials: true });
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                desciption: "Failed to load the seach results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
    }

    const accessChat = async (userId) => {
        setLoading(true);
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        }
        try {
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                desciption: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            return;
        }
    }

    const deleteNotification = async (chatId) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo?.notifications) {
            const idToRemove = chatId;

            userInfo.notifications = userInfo.notifications.filter(
                (notifId) => notifId._id !== idToRemove
            );
            // Save back to localStorage
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        // deletes this chatId from the notifications array of user 
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        }
        const body = {
            chatId: chatId,
        }
        try {
            await axios.post("/api/notif/delete", body, config);
        } catch (error) {
            toast({
                title: "Error Occured!",
                desciption: "Failed to remove the notification",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
    }
    useEffect(()=>{
        setNotificatons(user.notifications);
    }, []);
    return (
        <>
            <div className='
        d-flex
        justify-content-between
        align-items-center
        border border-2
        ' style={{ width: "100%", padding: "5px 10px 5px 10px", backgroundColor: "white" }}>
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    {/*Tooltip is used to display additional information when a user hovers over an element.   Use the hasArrow prop to show an arrow on the tooltip.   Use the placement prop to change the position of the tooltip.*/}
                    <button className='btn btn-light' type="button" data-bs-toggle="offcanvas" data-bs-target="#searchDrawer">
                        <div className='d-flex justify-content-center align-items-center'>
                            <i className="fa-solid fa-magnifying-glass me-2"></i>
                            {/* Used from font awesome library , it's cdn is included in index.html */}
                            <p className='d-none d-md-flex' style={{ fontWeight: "500", margin: "0px" }}>Search User</p>
                        </div>
                    </button>
                </Tooltip>
                <h1 style={{ fontFamily: "Work Sans" }}>Qnect</h1>
                <div className='d-flex '>
                    <div className='me-2'>
                        <button className="btn position-relative" type="button" id="dropdownMenu1" data-bs-toggle="offcanvas" data-bs-target="#notificationsPanel" aria-expanded="false">
                            <i className="fa-solid fa-bell" style={{ margin: "1px" }}></i>
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "0.6rem" }}
                            >
                                {notifications.length}
                            </span>
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="modal" data-bs-target="#profileModal">
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </button>
                    </div>
                </div>
            </div>
            <div className='offcanvas offcanvas-start'
                /* offcanvas-start places it on left*/
                tabIndex="-1"
                /* Makes it not focusable by default*/
                id="searchDrawer"
            >
                <div className='offcanvas-header'>
                    <h5 className="offcanvas-title" id="searchDrawerLabel">
                        Search Users
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className='offcanvas-body'>
                    <div className='d-flex mb-3'>
                        <input type="text" className='form-control me-2'
                            placeholder="Search by name or email"
                            value={search}
                            // makes the I/P controlled 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className='btn btn-outline-primary' onClick={handleSearch}>Go</button>
                    </div>
                    {loading ? (<ChatLoading />) : (
                        searchResult?.map((user) => {
                            return (<UserListItem key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}>
                                {/* we must use return if we want to return what the function being called returns , but if we donot write curly braces then it is short for return  */}
                                {/* key is not a regular prop or attribute. It is a special attribute in React, used only by the React engine to: Uniquely identify elements in a list.*/}
                                {/*It is recommended to be used for dynamic arrays */}
                            </UserListItem>)
                        })
                    )}
                </div>
            </div>
            <div className='offcanvas offcanvas-end'
                /* offcanvas-start places it on left*/
                tabIndex="-1"
                /* Makes it not focusable by default*/
                id="notificationsPanel"
            >
                <div className='offcanvas-header'>
                    <h5 className="offcanvas-title" id="notificationsPanelLabel">
                        Notifictaions
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className='offcanvas-body'>
                    {!notifications.length ? (
                        <div className='ps-2 rounded' style={{ backgroundColor: "#f3f4f6" }}>No New Messages</div>
                    ) : (<div className='d-flex flex-column'>
                        {notifications.map((notif) => {
                            return (
                                <div className="ps-2 pt-2 rounded " style={{ backgroundColor: "#dbeafe", cursor: "pointer" }} key={notif._id} onClick={async() => {
                                    setSelectedChat(notif)
                                    await deleteNotification(notif._id)
                                    setNotificatons((prevNotifications) =>
                                        prevNotifications.filter((n) => n._id !== notif._id)
                                    );
                                    const offcanvasEl = document.getElementById("notificationsPanel");
                                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                                    offcanvasInstance?.hide();
                                    const backdrop = document.querySelector('.offcanvas-backdrop');
                                    if (backdrop) backdrop.remove();
                                }}>
                                    {notif.isGroupChat ? <p className='#1e40af'>{`New Message in ${notif.chatName}`}</p> : <p className='#1e40af'>{`New Message from ${getSender(user, notif.users)[0].name}`}</p>}
                                </div>
                            )
                        })}
                    </div>)}
                </div>
            </div>
            <div className="modal fade" id="profileModal">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1>{user.name}</h1>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className='modal-body d-flex flex-column justify-content-center align-items-center'>
                            <Avatar size="2xl" cursor="pointer" src={user.pic} />
                            <p className='mt-3'>Email : {user.email}</p>
                        </div>
                        <div className='modal-footer'>
                            <button className="btn btn-light" onClick={logoutHandler} type="button">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideDrawer;