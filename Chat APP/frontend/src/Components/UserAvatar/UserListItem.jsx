import React from 'react';
import { ChatState } from '../../Context/chatProvider';
import { Avatar } from '@chakra-ui/react';
import * as bootstrap from 'bootstrap';

const UserListItem = ({ user, handleFunction }) => {
    return (
        <div
            onClick={() => {
                handleFunction()
                const canvas = document.getElementById("searchDrawer");
                const bsCanvas = bootstrap.Offcanvas.getOrCreateInstance(canvas);
                bsCanvas.hide();

                setTimeout(() => {
                    document.querySelectorAll('.offcanvas-backdrop').forEach(b => b.remove());
                    document.body.classList.remove('offcanvas-backdrop');
                }, 300);

            }
            }
            style={{
                cursor: "pointer",
                backgroundColor: "#E8E8E8",
                width : "100%"
            }}
            className='d-flex
        align-items-center
        w-100
        px-3
        py-2
        mb-2
        rounded'
            onMouseOver={(e) => {
                e.currentTarget.style.background = "#38B2AC"
                e.currentTarget.style.color = "white"
                // iske uper jese hi mouse jayega ye trigger ho jayega 
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = "#E8E8E8"
                e.currentTarget.style.color = "black";
            }}>
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic} />
            <div>
                <div>{user.name}</div>
                <div style={{ fontSize: "0.75rem" }}>
                    <strong>Email :</strong>
                    {user.email}
                </div>
            </div>
        </div>

    )
}

export default UserListItem;