import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ChatState } from '../../Context/chatProvider';
import { useToast } from "@chakra-ui/toast";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import {  Spinner} from "@chakra-ui/react";
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupModal = (props) => {
    const [groupChatName, setGroupChatName] = useState();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoadinh] = useState(false);
    const toast = useToast();

    const handleRemove = async(user1) => { 
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try{
            setLoading(true);
            const config={
                headers: {
                "Content-type": "application/json",
            },
                withCredentials: true 
            }
            const {data} = await axios.put("/api/chat/groupremove" , {
                chatId : selectedChat._id ,
                userId : user1._id
            } , config);
            setSelectedChat(data);
            setLoading(false);
            props.setFetchAgain(!props.fetchAgain);
            props.fetchMessages();
        } catch(error){
            toast({
                title: "Error Occured!",
                description: error?.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
    }
    const handleLeaveGroup = async()=>{
        if(selectedChat.groupAdmin._id === user._id){
            toast({
                title: "Admin cannot leave the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try{
            setLoading(true);
            const config={
                headers: {
                "Content-type": "application/json",
            },
                withCredentials: true 
            }
            const {data} = await axios.put("/api/chat/groupremove" , {
                chatId : selectedChat._id ,
                userId : user._id
            } , config);
            setSelectedChat(data);
            setLoading(false);
            props.setFetchAgain(!props.fetchAgain);
            props.fetchMessages();
        } catch(error){
            toast({
                title: "Error Occured!",
                description: error?.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
            setLoading(false);
            setSearchResult(data);
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
    const handleRename = async() => { 
        if(!groupChatName) return 

        try{
            const config={
                headers: {
                "Content-type": "application/json",
            },
                withCredentials: true 
            }
            const {data}=await axios.put("/api/chat/rename" , {
                chatId : selectedChat._id ,
                newChatName : groupChatName
            } , config)

            setSelectedChat(data);
            props.setFetchAgain(!props.fetchAgain);
        } catch(error){
            toast({
                title: "Error Occured!",
                description: error?.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        setGroupChatName("");
    }

    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find((u) => u._id === user1._id)){
            toast({
                title: "User already in the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }

        try{
            setLoading(true)
            const config={
                headers: {
                "Content-type": "application/json",
            },
                withCredentials: true 
            }

            const {data} = await axios.put("/api/chat/groupadd" , {chatId : selectedChat._id , userId : user1._id} , config);

            setSelectedChat(data);
            props.setFetchAgain(!props.fetchAgain);
            setLoading(false);
        } catch(error){
            toast({
                title: "Error Occured!",
                description: error?.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
    }
    return (
        <>
            <button type="button" onClick={() => props.setShowGroupModal(true)}><i className="fa-solid fa-eye"></i></button>
            <Modal show={props.showGroupModal} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: "Work Sans", width: "100%", textAlign: "center" }}>
                        {selectedChat.chatName}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="d-flex flex-column justify-content-start align-items-center w-100">
                    <div className='d-flex flex-wrap justify-content-start mb-2 w-100'>
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                        ))}
                    </div>
                    <Form style={{ width: "100%", height: "100%" }}>
                        <div className='d-flex'>
                            <Form.Control
                                type="text"
                                placeholder="Chat Name"
                                className='mb-3'
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value)
                                    console.log("group chat name jo set hua ", groupChatName);
                                }}
                            />
                            <button className='btn btn-sm ms-1 rounded' type="button" onClick={handleRename} style={{ backgroundColor: "teal", color: "white", height: "37px" }}>Update</button>
                        </div>
                        <div className='d-flex'>
                            <Form.Control
                                type="text"
                                placeholder="Add User to group"
                                className='mb-2'
                                value={search}
                                onChange={(e) => {
                                    handleSearch(e.target.value)
                                    console.log("Search results jo set hue", searchResult);
                                }}
                            />
                            
                        </div>
                        {loading ? (<p>Loading...</p>) : (
                            searchResult?.map((u)=>{
                                return <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                            })
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleLeaveGroup}>
                        Leave Group
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateGroupModal;