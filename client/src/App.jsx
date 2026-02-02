import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./pages/home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import "./App.css";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

const App = () => {
    return (
        <div className="App">
            <Router>
                <nav className="navbar">
                    <Link to="/Createpost">Create a post</Link>{" "}
                    <Link to="/">Homepage</Link>{" "}
                    <Link to="auth/login">login boss</Link>{" "}
                    <Link to="/registration">Register</Link>{" "}
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Createpost" element={<CreatePost />} />
                    <Route path="/post/:id" element={<Post />}></Route>
                    <Route path="/auth/login" element={<Login />}></Route>
                    <Route
                        path="/registration"
                        element={<Registration />}
                    ></Route>
                </Routes>
            </Router>
        </div>
    );
};
export default App;
