import React from "react";
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AuthContext } from "../helpers/Context";

export const Home = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [listofPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        if (!authState.status) {
            navigate("/auth/login");
        } else {
            navigate("/");
        }
        Axios.get("http://localhost:3000/posts", {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response) => {
            setListOfPosts(response.data.postList);
            setLikedPosts(
                response.data.likedPosts.map((like) => {
                    return like.PostId;
                }),
            );
        });
    }, []);
    const likePost = (postId, e) => {
        e.stopPropagation();
        Axios.post(
            "http://localhost:3000/likes",
            { PostId: postId },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            },
        ).then((response) => {
            // alert(response.data.message);
            setListOfPosts(
                listofPosts.map((post) => {
                    if (post.id === postId) {
                        if (response.data.liked) {
                            return { ...post, Likes: [...post.Likes, 0] }; //modify likes array by adding a dummy element to it (0) so that the length of the array increases by 1 and the like count updates without refreshing
                        }
                        return { ...post, Likes: post.Likes.slice(0, -1) }; //remove the last element from the likes array if unliked
                    } else {
                        return post;
                    }
                }),
            );
            if (response.data.liked) {
                setLikedPosts([...likedPosts, postId]); //add the postId to the likedPosts array if it's not already there
            } else {
                setLikedPosts(likedPosts.filter((id) => id !== postId)); //remove the postId from the likedPosts array if it's there
            }
        });
    };
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
                        <div className="footer">
                            - {value.username}
                            <div
                                className={
                                    likedPosts.includes(value.id)
                                        ? "unlikebutton"
                                        : "likebutton"
                                }
                            >
                                <FavoriteIcon
                                    onClick={(e) => likePost(value.id, e)}
                                />
                            </div>
                            <label className="likes-count">
                                {value.Likes.length}
                            </label>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
