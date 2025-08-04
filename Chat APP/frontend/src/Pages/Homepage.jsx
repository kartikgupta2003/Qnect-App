import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "../Components/Authentication/Signup";
import Login from "../Components/Authentication/Login";
import axios from 'axios';
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if(user){
            axios.get("/api/user/validate" , {withCredentials : true})
            .then((res)=>{
                navigate("/chats");
            })
            .catch((err)=>{
                localStorage.removeItem("userInfo");
                // Backend me error global handler catch karega and then 
                // wo error res bhejga jisko ye catch kar lega !!
            })
        }
    } , [])
    // When you navigate to a different route using navigate(), React Router: Unmounts the current component, Mounts the new route's component which triggers useEffect() and the full render cycle for that new component.
    return (
        <div className='d-flex flex-column container-xl align-items-center ' style={{ transform: "scale(0.75)", transformOrigin: "top center" }}>
            {/* This scales the contents to 90% of the original size — making it look smaller without breaking responsiveness. */}
            <div className="bg-white border rounded p-2" style={{ width: '100%', maxWidth: '500px', marginTop: '20px' }}>
                <h1 className="text-center" style={{ fontFamily: 'Work Sans', fontSize: '2.5rem' }}>
                    Qnect
                </h1>
            </div>
            <div className="bg-white border rounded p-2" style={{ width: '100%', maxWidth: '500px', marginTop: '20px' }}>
                <ul className="nav nav-pills mb-3 d-flex justify-content-start align-items-center" id="authTabs">
                    {/* nav-pills  styles the tab buttons to look like pills (soft-rounded buttons) instead of regular tab-style links.*/}
                    {/* nav-justified This class makes all tabs take equal width, spreading them across the full horizontal space of the container. */}
                    <li className="nav-item me-3">
                        <button className='nav-link bg-light text-dark rounded-pill px-3 py-2 w-100'
                            // px-4 → padding-left & padding-right = 1.5rem  
                            //  py-2 → padding-top & padding-bottom = 0.5rem
                            id="login-tab"
                            data-bs-toggle="pill"
                            // When the button is clicked: It becomes active Its corresponding content pane (matched by data-bs-target="#login") becomes visible All other tabs and content panes are deactivated
                            data-bs-target="#login"
                            type="button"
                        // So, if you don’t explicitly write type="button" and this button is inside a form, it might accidentally submit the form — even if you're just trying to toggle tabs or open a modal.
                        >Login</button>
                    </li>
                    <li className="nav-item">
                        <button
                            className='nav-link bg-light text-dark rounded-pill px-3 py-2 w-100'
                            id="signup-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#signup"
                            type="button">
                            Sign up
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="authTabsContent">
                    <div
                        className="tab-pane fade "
                        id="login"
                        role="tabpanel"
                        aria-labelledby="login-tab"
                    >
                        <Login />
                    </div>
                    <div
                        className="tab-pane fade"
                        id="signup"
                        role="tabpanel"
                        aria-labelledby="signup-tab"
                    >
                        <Signup />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;