import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const login = () => {
        const data = { username, password };
        axios
            //login attempt to /auth/login using data(username,password) from the state
            .post("http://localhost:3000/auth/login", data)
            .then((response) => {
                sessionStorage.setItem("accessToken", response.data);
                navigate("/");
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    alert(error.response.data.error);
                } else {
                    alert("An error occurred during login.");
                }
            });
    };
    return (
        <div>
            <input
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>login</button>
        </div>
    );
}

export default Login;
