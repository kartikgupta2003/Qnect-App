import React from 'react';

const UserBadgeItem = (props) =>{
    return(
        <div className='ps-2 pe-2 pt-1 pb-1
        m-1 rounded'
        style={{fontSize : "12px" , color : "white" , backgroundColor : "purple" , cursor : "pointer"}}
        onClick={props.handleFunction}>
            {props.user.name}
            <i className="fa-solid fa-xmark ms-1"></i>
        </div>
    )
}

export default UserBadgeItem;