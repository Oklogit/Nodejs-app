import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { FloatingLabel } from "flowbite-react";
import { Link } from "react-router-dom";

const Registration = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(20).required("Username is required"),
        password: Yup.string().min(4).max(25).required("Password is required"),
    });

    const onSubmit = (data) => {
        setError("");
        setLoading(true);
        Axios.post(`${import.meta.env.VITE_API_URL}/auth`, data)
            .then((response) => {
                // Redirect to login or auto-login
                window.location.href = "/auth/login";
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setError(err.response.data.error || "Registration failed");
                } else {
                    setError("An error occurred during registration.");
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-white flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-primaryBlue text-center mb-2">
                    Sign Up
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Join bkblog today
                </p>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 font-semibold text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ values, setFieldValue, touched, errors }) => (
                        <Form className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
                            <div>
                                <FloatingLabel
                                    variant="filled"
                                    label="Username"
                                    value={values.username}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "username",
                                            e.target.value,
                                        )
                                    }
                                    // color={
                                    //     errors.username && touched.username
                                    //         ? "failure"
                                    //         : error
                                    //           ? "failure"
                                    //           : undefined
                                    // }
                                />
                                {errors.username && touched.username && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <FloatingLabel
                                    variant="filled"
                                    label="Password"
                                    type="password"
                                    value={values.password}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "password",
                                            e.target.value,
                                        )
                                    }
                                    // color={
                                    //     errors.password && touched.password
                                    //         ? "failure"
                                    //         : error
                                    //           ? "failure"
                                    //           : undefined
                                    // }
                                />
                                {errors.password && touched.password && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-coral to-red-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/auth/login"
                        className="text-coral font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Registration;
