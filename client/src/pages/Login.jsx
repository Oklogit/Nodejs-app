import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/Context";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext); //grab setAuthState from context of AuthContext
    let navigate = useNavigate();

    const login = () => {
        const data = { username, password };
        axios
            //login attempt to /auth/login using data(username,password) from the state
            .post("http://localhost:3000/auth/login", data)
            .then((response) => {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                }); //set authState to true upon successful login
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
