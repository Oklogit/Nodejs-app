import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./pages/home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import "./App.css";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/Context";
import axios from "axios";
import Pagenotfound from "./pages/Pagenotfound";

const App = () => {
    const [authState, setAuthState] = useState({
        username: "",
        id: 0,
        status: false,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/auth/auth", {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                if (response.data.error) {
                    setAuthState({ ...authState, status: false }); //keeps other properties unchanged but sets status to false
                } else {
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });
                }
            });
    }, []);
    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
    };

    return (
        <div className="App">
            {/* everything inside AuthContext.Provider can access authState and setAuthState */}
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <nav className="navbar">
                        {!authState.status ? (
                            <>
                                <Link to="/auth/login">login boss</Link>{" "}
                                <Link to="/registration">Register</Link>{" "}
                            </>
                        ) : (
                            <>
                                <Link to="/Createpost">Create a post</Link>{" "}
                                <Link to="/">Homepage</Link>{" "}
                            </>
                        )}
                        <div className="loggedIncont">
                            <button onClick={logout}>Logout</button>{" "}
                            {authState.status && (
                                <h3>Welcome, {authState.username}</h3>
                            )}
                        </div>
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
                        <Route path="*" element={<Pagenotfound />}></Route>
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
};
export default App;
