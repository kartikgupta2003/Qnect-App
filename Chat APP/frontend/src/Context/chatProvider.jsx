import { createContext , useState , useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const chatContext = createContext(null);

export const ChatState = ()=>{
    return useContext(chatContext);
}

export const ChatProvider = (props)=>{
    const [user , setUser] = useState();
    const [selectedChat , setSelectedChat]= useState();
    const [chats , setChats] = useState([]);
    const [notifications , setNotificatons] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(!userInfo){
            navigate("/");
        }
        console.log("user is ",userInfo);
        setUser(userInfo);
    } , [location.pathname])
// Now your effect runs:

// On initial mount ✅

// Every time the route changes ✅
// It checks localStorage.getItem("userInfo")
    return (
        <chatContext.Provider value={{user , setUser , selectedChat , setSelectedChat , chats , setChats , notifications , setNotificatons}}>
            {props.children}
        </chatContext.Provider>
    )
}
