import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./pages/home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import "./App.css";

const App = () => {
    return (
        <div className="App">
            <Router>
                <Link to="/Createpost">Create a post</Link>{" "}
                <Link to="/">Homepage</Link>{" "}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Createpost" element={<CreatePost />} />
                    <Route path="/post/:id" element={<Post />}></Route>
                </Routes>
            </Router>
        </div>
    );
};
export default App;
