import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { AuthContext } from "../helpers/Context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";

const CreatePost = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    const onSubmit = (data) => {
        Axios.post("http://localhost:3000/posts", data, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response) => {
            navigate("/");
        });
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/auth/login");
        }
    }, []);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        postText: Yup.string().required("Post text is required"),
    });

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ errors, touched }) => (
                <Form className="min-h-[88vh] mt-[50px] w-full flex flex-col px-6 py-6">
                    <h2 className="text-3xl font-bold text-primaryBlue mb-8">
                        Create a New Post
                    </h2>

                    {/* Title */}
                    <div className="mb-6 w-[40%] min-w-[300px]">
                        <Label
                            htmlFor="title"
                            value="Post Title"
                            className="mb-2"
                        >
                            Title
                        </Label>
                        <Field
                            id="title"
                            name="title"
                            as={TextInput}
                            placeholder="Enter an engaging title..."
                            className={`w-full ${errors.title && touched.title ? "border-red-500" : ""}`}
                        />
                        <ErrorMessage
                            name="title"
                            component="p"
                            className="text-red-500 text-sm mt-2"
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-6 flex-1 flex flex-col">
                        <Label
                            htmlFor="postText"
                            value="Post Content"
                            className="mb-2"
                        >
                            Content
                        </Label>
                        <Field
                            id="postText"
                            name="postText"
                            as={Textarea}
                            placeholder="Share your thoughts..."
                            className={`flex-1 min-h-[300px] p-4 text-md w-full ${errors.postText && touched.postText ? "border-red-500" : ""}`}
                        />
                        <ErrorMessage
                            name="postText"
                            component="p"
                            className="text-red-500 text-sm mt-2"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-6">
                        <Button
                            type="submit"
                            className="flex-1 max-w-[200px] bg-primaryBlue text-white font-bold py-3 rounded-lg hover:opacity-90"
                        >
                            Publish Post
                        </Button>

                        <Button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 max-w-[200px] bg-red-500 text-white font-bold py-3 rounded-lg hover:opacity-90"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CreatePost;
