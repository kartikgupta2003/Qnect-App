import React, { useState } from 'react';
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
    const submitHandler = async (e) => {
        if (!email || !password) {
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
                    withCredentials : true
                    // this allows cookies to be sent to backend after we set up CORS
            }
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config,
            );
            // Axios automatically parses the JSON response and gives you the result as a JS object:
            // Fetch ke sath isliye hume res.json() lagana padta hai kyuki wo esa nhi karta hai 


            // console.log(data);
            // agar login credentials wrong honge to pehle 
            // backend error throw karega which will get recieved by error handler function in middlewares 
            // jo ki ab ek json response bhejega with status code not 2xx to wo axios catch karega 
            // and catch block ko de dega
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            // localStorage stores only strings and udhar se to json format me hi aya tha but usko axios ne parse kar diya tha
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    return (
        <form>
            <div class="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address <span className="text-danger">*</span></label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email}
                    onChange={(e) => {
                        return setEmail(e.target.value);
                    }} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password <span className="text-danger">*</span></label>
                <div className='input-group'>
                    <input type={showPassword ? 'text' : 'password'} className="form-control" id="exampleInputPassword1" value={password}
                        // jab hum loging using guest credentials karte hai to wo email and password ki ek default value set kar deta hai 
                        // and value attribute ki wajah se wo dikh jati hai 
                        onChange={(e) => {
                            return setPassword(e.target.value);
                        }} />
                    <button className='btn btn-outline-secondary'
                        type="button"
                        onClick={handleToggle}>
                        {showPassword ? <>Hide</> : <>Show</>}
                    </button>
                </div>
            </div>
            <button type="button" className="btn btn-primary w-100 mb-3" onClick={(e) => {
                submitHandler()
            }}>Login</button>
            <button type="button" className="btn btn-danger w-100" onClick={(e) => {
                setEmail("guest@example.com")
                setPassword("123456")
            }}>Get Guest User Credentials</button>
        </form>
    )
}

export default Login;