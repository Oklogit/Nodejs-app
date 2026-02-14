import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { data, Navigate } from "react-router-dom";
import * as Yup from "yup";
import Axios from "axios";
import { AuthContext } from "../helpers/Context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        })
            .then((response) => {})
            .then((response) => {
                // console.log("success");
            });
        navigate("/");
    };
    useEffect(() => {
        if (!authState.status) {
            navigate("/auth/login");
        }
    }, []);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        postText: Yup.string().required(),
    });
    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="newpostForm">
                    <label>Title</label>
                    <ErrorMessage name="title" component="span" />
                    <Field
                        id="postInput"
                        name="title"
                        placeholder="your title"
                    />
                    <label>postInput</label>
                    <ErrorMessage name="postText" component="span" />

                    <Field
                        id="postInput"
                        name="postText"
                        placeholder="your post"
                    />

                    <button type="submit">Submit Form</button>
                </Form>
            </Formik>
        </div>
    );
};

export default CreatePost;
