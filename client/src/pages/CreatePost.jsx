import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { data } from "react-router-dom";
import * as Yup from "yup";
import Axios from "axios";

const CreatePost = () => {
    const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    const onSubmit = (data) => {
        Axios.post("http://localhost:3000/posts", data).then((response) => {
            // console.log("success");
        });
    };
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Fill or die   "),
        postText: Yup.string().required(),
        username: Yup.string().min(3).max(40).required(),
    });
    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form>
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

                    <label>username</label>
                    <ErrorMessage name="username" component="span" />

                    <Field
                        id="postInput"
                        name="username"
                        placeholder="your name"
                    />
                    <button type="submit">Submit Form</button>
                </Form>
            </Formik>
        </div>
    );
};

export default CreatePost;
