import React from "react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    const [listofPosts, setListOfPosts] = useState([]);
    useEffect(() => {
        Axios.get("http://localhost:3000/posts").then((response) => {
            setListOfPosts(response.data);
        });
    }, []);
    return (
        <div>
            {listofPosts.map((value, key) => {
                return (
                    <div
                        key={key}
                        className="post"
                        onClick={() => {
                            navigate(`/post/${value.id}`);
                        }}
                    >
                        <div className="title">{value.title}</div>
                        <div className="body">{value.postText}</div>
                        <div className="footer">- {value.username}</div>
                    </div>
                );
            })}
        </div>
    );
};
