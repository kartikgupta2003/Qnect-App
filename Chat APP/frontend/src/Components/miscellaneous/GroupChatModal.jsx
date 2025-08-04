import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "Work Sans", width: "100%", textAlign: "center" }}>
                    Create Group Chat
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="d-flex flex-column align-items-center">
                <Form style={{ width: "100%" }}>
                    <Form.Control
                        type="text"
                        placeholder="Chat Name"
                        className='mb-3'
                        value={props.groupChatName}
                        onChange={(e) => {props.setGroupChatName(e.target.value)
                            console.log("group chat name jo set hua " , props.groupChatName);
                        }}
                    />
                    <Form.Control
                        type="text"
                        placeholder="Add Users eg: Itachi, Kartik, Naruto"
                        className='mb-2'
                        value={props.search}
                        onChange={(e) => {props.handleSearch(e.target.value)
                            console.log("Search results jo set hue" , props.searchResult);
                        }}
                    />
                </Form>
                <div className='d-flex flex-wrap justify-content-start mb-2 w-100'>
                    {props.selectedUsers.map((user) => (
                        <UserBadgeItem key={user._id} user={user} handleFunction={() => props.handleDelete(user)} />
                    ))}
                </div>

                {props.loading ? (
                    <div>Loading...</div>
                ) : (
                    props.searchResult?.slice(0, 4).map((user) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => props.handleGroup(user)} />
                    ))
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleSubmit}>
                    Create Chat
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GroupChatModal;