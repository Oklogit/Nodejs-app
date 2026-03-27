import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/Context";
import { FloatingLabel } from "flowbite-react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    const login = () => {
        setError("");
        setLoading(true);
        const data = { username, password };
        axios
            .post("http://localhost:3000/auth/login", data)
            .then((response) => {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
                navigate("/");
            })
            .catch((error) => {
                console.error("Login error:", error);
                if (error.response?.data?.error) {
                    setError(error.response.data.error);
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }

                // if (error.response?.data?.error) {
                //     errorMsg = error.response.data.error;
                // } else if (error.response?.data) {
                //     errorMsg =
                //         typeof error.response.data === "string"
                //             ? error.response.data
                //             : JSON.stringify(error.response.data);
                // } else if (error.message) {
                //     errorMsg = error.message;
                // }

                setLoading(false);
            });
    };
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-white flex flex-col justify-center items-center px-4 py-8 overflow-auto z-50">
            <div className="w-full max-w-md my-auto">
                <h1 className="text-4xl font-bold text-primaryBlue text-center mb-2">
                    Login
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Welcome back to bkblog
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg shadow-md">
                        <p className="text-red-700 font-semibold text-sm">
                            ⚠️ {error}
                        </p>
                    </div>
                )}

                <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <FloatingLabel
                        variant="filled"
                        label="Username"
                        value={username || ""}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        // color={error ? "error" : "gray"}
                    />
                    <FloatingLabel
                        variant="filled"
                        label="Password"
                        type="password"
                        value={password || ""}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        // color={error ? "failure" : undefined}
                    />

                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-coral to-red-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/registration"
                        className="text-coral font-semibold hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
