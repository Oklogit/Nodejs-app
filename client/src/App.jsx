import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./pages/home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
// import "./App.css";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/Context";
import axios from "axios";
import Pagenotfound from "./pages/Pagenotfound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";

const App = () => {
    const navigate = useNavigate();

    const [authState, setAuthState] = useState({
        username: "",
        id: 0,
        status: false,
    });

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/auth/auth`, {
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
            })
            .catch(() => {
                setAuthState({ username: "", id: 0, status: false });
            });
    }, []);
    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
        navigate("/auth/login");
    };

    return (
        <div className="App bg-slate-50">
            {/* everything inside AuthContext.Provider can access authState and setAuthState */}
            <AuthContext.Provider value={{ authState, setAuthState }}>
                {/* <Router> */}
                <Navbar className="px-4 bg-gradient-to-r from-primaryBlue to-blue-900 shadow-lg fixed w-full top-0 z-50">
                    <NavbarBrand as={Link} href="/">
                        {/* Inline SVG */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="mr-3 h-6 sm:h-9 fill-coral"
                        >
                            <path d="M224 24c0-13.3 10.7-24 24-24 145.8 0 264 118.2 264 264 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-119.3-96.7-216-216-216-13.3 0-24-10.7-24-24zM80 96c26.5 0 48 21.5 48 48l0 224c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48c-8.8 0-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16 79.5 0 144 64.5 144 144S255.5 512 176 512 32 447.5 32 368l0-224c0-26.5 21.5-48 48-48zm168 0c92.8 0 168 75.2 168 168 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-66.3-53.7-120-120-120-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                        </svg>

                        {/* Brand Text */}
                        <span className="self-center whitespace-nowrap text-2xl font-bold text-white">
                            bkblog
                        </span>
                    </NavbarBrand>
                    <>
                        {authState.status && (
                            <div className="flex items-center gap-2 md:order-2 ml-auto">
                                {/* <span className="text-white font-semibold hidden sm:inline">
                                            {authState.username}
                                        </span> */}
                                <Button color="red" onClick={logout} size="sm">
                                    Logout
                                </Button>
                            </div>
                        )}
                        <NavbarToggle />
                    </>
                    <NavbarCollapse className="md:flex md:items-center md:gap-6 md:ml-6">
                        {!authState.status ? (
                            <>
                                <NavbarLink
                                    as={Link}
                                    to="/auth/login"
                                    className="text-white hover:text-coral transition-colors"
                                >
                                    Login
                                </NavbarLink>
                                <NavbarLink
                                    as={Link}
                                    to="/registration"
                                    className="text-white hover:text-coral transition-colors"
                                >
                                    Sign Up
                                </NavbarLink>
                            </>
                        ) : (
                            <>
                                <NavbarLink
                                    as={Link}
                                    to="/Createpost"
                                    className="text-white hover:text-coral transition-colors"
                                >
                                    Create Post
                                </NavbarLink>
                                <NavbarLink
                                    as={Link}
                                    to="/"
                                    className="text-white hover:text-coral transition-colors"
                                >
                                    Home
                                </NavbarLink>
                                <NavbarLink
                                    as={Link}
                                    to={`/auth/basicinfo/${authState.id}`}
                                    className="text-white hover:text-coral transition-colors"
                                >
                                    Profile
                                </NavbarLink>
                                {/* <div className="flex items-center gap-4 "></div> */}
                            </>
                        )}
                    </NavbarCollapse>
                </Navbar>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Createpost" element={<CreatePost />} />
                    <Route path="/post/:id" element={<Post />}></Route>
                    <Route path="/auth/login" element={<Login />}></Route>
                    <Route
                        path="/registration"
                        element={<Registration />}
                    ></Route>
                    <Route
                        path="/auth/basicinfo/:id"
                        element={<Profile />}
                    ></Route>
                    <Route
                        path="/changepassword/:id"
                        element={<ChangePassword />}
                    ></Route>
                    <Route path="*" element={<Pagenotfound />}></Route>
                </Routes>
                {/* </Router> */}
            </AuthContext.Provider>
        </div>
    );
};
export default App;
