import React, { useState } from 'react';
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const toast = useToast();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [password, setPassword] = useState(null);
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    // all hook objects or states are always initialized at the top level of component 

    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
    const postDetails = (pics) => {
        // This function handles image upload.
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            // Only allows .jpeg or .png files.
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Qnect-app");
            data.append("cloud_name", "dfgfuvat7");
            fetch("https://api.cloudinary.com/v1_1/dfgfuvat7/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    // hme url mil rha hoga usko chrome pe dalenge to pics open ho jayegi
                    console.log(data.url.toString()); 
                }).catch((err) => {
                    console.log(err);
                })
        }
        else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
    }
    const submitHandler = async() => {
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please Fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if(password !== confirmPassword){
            toast({
                title: "Passwords donot match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try{
            const config ={
                headers : {
                    "Content-type" : "application/json",
                }
            }
            const {data} = await axios.post("/api/user" , {name ,email , password ,pic} , config)
            toast({
                title: "Registeration Successful ! Please Login ",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem('userInfo' , JSON.stringify(data));
            // navigate("/chats");
        } catch(error) {
            toast({
                title: "Error Occured",
                description : error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    return (
        <form>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="name" aria-describedby="inputname"
                    onChange={(e) => {
                        return setName(e.target.value);
                    }} />
            </div>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Email address <span className="text-danger">*</span></label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    onChange={(e) => {
                        return setEmail(e.target.value);
                    }} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password <span className="text-danger">*</span></label>
                <div className='input-group'>
                    <input type={showPassword ? 'text' : 'password'} className="form-control" id="exampleInputPassword1"
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
            <div className="mb-3">
                <label for="confirmInputPassword2" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control" id="confirmInputPassword2"
                    onChange={(e) => {
                        return setConfirmPassword(e.target.value);
                    }} />
            </div>
            <div className="mb-3">
                <label htmlFor="profilePic" className="form-label">
                    Upload Profile Picture
                </label>
                <input
                    className="form-control"
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    // Restricts selection to image files only (png, jpg, etc.) , jab hum upload file pe click karenge from device to wo options me kewal pics hi dikhayega my pc me 
                    required
                    onChange={(e) => {
                        postDetails(e.target.files[0]);
                    }}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100" onClick={(e) => {
                e.preventDefault(); 
                submitHandler() }} 
                >Sign UP</button>
        </form>
    )
}

export default Signup;