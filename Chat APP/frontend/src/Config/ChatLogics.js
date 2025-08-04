export const getSender = (loggedUser , users) =>{
    return (users.filter((user)=>{
        return (user._id != loggedUser._id);
    }))
}

export const isSameSender = (messages , m , i , userId) =>{
    console.log(m)
    console.log(
        (i < messages.length ) && 
        (messages[i].sender._id !== userId) &&
        (
            messages[i+1]=== undefined ||
            messages[i+1].sender._id !== m.sender._id 
        )
    )
    return(
        (i < messages.length ) && 
        (messages[i].sender._id !== userId) &&
        (
            messages[i+1]=== undefined ||
            messages[i+1].sender._id !== m.sender._id 
        )
    )
}

export const isLastMessage = (messages , i , userId) =>{
    console.log(
        i=== messages.length -1 && 
        messages[messages.length-1].sender._id !== userId &&
        messages[messages.length-1].sender._id
    )
    return(
        i=== messages.length -1 && 
        messages[messages.length-1].sender._id !== userId &&
        messages[messages.length-1].sender._id
    )
}

export const isSameUser=(mssg , userId)=>{
    return(mssg.sender._id === userId)
}