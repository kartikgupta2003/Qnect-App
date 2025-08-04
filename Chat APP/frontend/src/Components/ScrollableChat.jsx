import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {isSameSender , isLastMessage , isSameUser} from '../Config/ChatLogics.js';
import { ChatState } from '../Context/chatProvider.jsx';
import { Tooltip, Avatar } from '@chakra-ui/react';

const ScrollableChat = ({messages})=>{
    const {user} = ChatState();
    return(
        <ScrollableFeed>
            {messages && messages.map((mssg , i)=>{
                return(
                    <div
                className ='d-flex'
                key={mssg._id}>
                    {
                        (isSameSender(messages , mssg , i , user._id)
                        || isLastMessage(messages , i , user._id))
                        && (
                            <Tooltip
                            label={mssg.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                              <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={mssg.sender.name}
                              src={mssg.sender.pic}/>
                            </Tooltip>
                        )
                    }
                    <span
                    style={{width:"100%"}}
                     className={`
                        d-flex
                     ${(isSameUser(mssg , user._id))?(
                        "justify-content-end"
                     ):("justify-content-start")}`}
                     ><div
                     className='rounded-5
                     ps-3
                     pe-3
                     pt-15
                     pb-15
                     mb-1'
                     style={{backgroundColor : `${(mssg.sender._id===user._id)
                        ?("#BEE3F8"):("#B9F5D0")
                     }` , maxWidth: "75%"}}>{mssg.content}</div></span>
                </div>
                )
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat ; 