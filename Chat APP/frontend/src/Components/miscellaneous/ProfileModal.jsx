import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { Tooltip, Avatar } from '@chakra-ui/react';

const ProfileModal = (props) => {
    return (
        <>
        <button type="button" onClick={() => props.setShowModal(true)}><i className="fa-solid fa-eye"></i></button>
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontFamily: "Work Sans", width: "100%", textAlign: "center" }}>
                    {props.user.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column align-items-center">
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <Avatar size="2xl" cursor="pointer" src={props.user.pic} />
                    <p className='mt-3'>Email : {props.user.email}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default ProfileModal;
