import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";

function Registration() {
    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(20).required(),
        password: Yup.string().min(2).max(25).required(),
    });
    const onSubmit = (data) => {
        Axios.post("http://localhost:3000/auth", data).then((response) => {
            // console.log("success");
        });
    };
    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="newpostForm">
                    <label>username</label>
                    <ErrorMessage name="username" component="span" />

                    <Field
                        id="postInput"
                        name="username"
                        placeholder="your name"
                    />
                    <label>username</label>
                    <ErrorMessage name="password" component="span" />

                    <Field
                        id="postInput"
                        name="password"
                        placeholder="your password"
                    />
                    <button type="submit">Submit Form</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
