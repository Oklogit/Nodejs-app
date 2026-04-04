import axios from "axios";
import { useState, useContext, useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/Context";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
// import { ref } from "yup";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setIsOpen] = useState(false);
    let ismyPost = authState.username === postObject.username;
    const ref = useRef();
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/posts/byId/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setPostObject(response.data);
                setLikesCount(response.data.likesCount);
                setIsLiked(response.data.likedByUser);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`${import.meta.env.VITE_API_URL}/comments/${id}`)
            .then((response) => {
                setComments(response.data);
            });
    }, []);

    const addComment = () => {
        axios
            .post(
                `${import.meta.env.VITE_API_URL}/comments`,
                {
                    commentBody: newComment,
                    PostId: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                },
            )
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    const addedComment = {
                        commentBody: newComment,
                        username: response.data.username,
                    };
                    setComments([...comments, addedComment]);
                    setNewComment("");
                }
            });
    };

    const deleteComment = (commentId) => {
        axios
            .delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                alert("Comment deleted");
                setComments(comments.filter((val) => val.id !== commentId));
            });
    };

    const deletePost = (id) => {
        axios
            .delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                navigate("/");
            });
    };

    const editPost = (field) => {
        if (field === "title") {
            let newTitle = prompt("Enter new title:");
            if (newTitle) {
                axios.put(
                    `${import.meta.env.VITE_API_URL}/posts/title`,
                    { newTitle: newTitle, id: id },
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                        },
                    },
                );
                setPostObject({ ...postObject, title: newTitle });
            }
        } else {
            let newPostText = prompt("Enter new post text:");
            if (newPostText) {
                axios.put(
                    `${import.meta.env.VITE_API_URL}/posts/postText`,
                    { newPostText: newPostText, id: id },
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                        },
                    },
                );
                setPostObject({ ...postObject, postText: newPostText });
            }
        }
    };
    const likePost = (e) => {
        e.stopPropagation();
        Axios.post(
            `${import.meta.env.VITE_API_URL}/likes`,
            { PostId: id },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            },
        ).then((response) => {
            if (response.data.liked) {
                setLikesCount((prev) => prev + 1);
                setIsLiked(response.data.liked);
            } else {
                setLikesCount((prev) => prev - 1);
                setIsLiked(response.data.liked);
            }
        });
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-[50px] flex flex-col items-start gap-8 px-4 py-8">
            <div className="w-full px-4 py-8">
                {/* <Card className="w-full max-w-2xl shadow-lg border border-gray-200"> */}
                <div className="flex flex-row  items-center gap-2 p-6 rounded-t-lg -mx-6 mt-6 mb-4">
                    <h1 className="text-3xl font-bold text-primaryBlue ">
                        {postObject.title}
                    </h1>
                    <div className="relative flex" ref={ref}>
                        <button
                            className="text-3xl px-2 hover:bg-gray-200 mx-10 rounded"
                            title="options"
                            onClick={() => setIsOpen(!open)}
                        >
                            {" "}
                            <MoreVertIcon fontSize="large" />{" "}
                        </button>
                        {/* Dropdown */}
                        {open && (
                            <div className="absolute top-10 mt-4 w-36 bg-white border rounded shadow z-50">
                                {!ismyPost ? (
                                    <div className="flex flex-col">
                                        <button
                                            className="block w-full px-4 py-2 hover:bg-gray-100"
                                            onClick={() =>
                                                authState.username ===
                                                    postObject.username &&
                                                editPost("title")
                                            }
                                        >
                                            Edit Title
                                        </button>
                                        <button
                                            className="block w-full px-4 py-2 hover:bg-gray-100 "
                                            onClick={() => {
                                                if (ismyPost) {
                                                    editPost("body");
                                                }
                                            }}
                                        >
                                            Edit Post
                                        </button>{" "}
                                        <button
                                            className="text-red-500"
                                            onClick={() =>
                                                deletePost(postObject.id)
                                            }
                                            size="md"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="block w-full px-4 py-2 hover:bg-gray-100"
                                        onClick={() =>
                                            navigate(
                                                `/auth/basicinfo/${postObject.UserId}`,
                                            )
                                        }
                                    >
                                        View Profile
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`text-xl text-gray-700 leading-relaxed mb-6 p-4 rounded-lg whitespace-pre-line   ${
                        authState.username === postObject.username
                            ? "hover:bg-opacity-20 transition-colors"
                            : ""
                    }`}
                >
                    {postObject.postText}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                        by{" "}
                        <span
                            className="font-semibold text-primaryBlue"
                            onClick={() =>
                                navigate(`/auth/basicinfo/${postObject.UserId}`)
                            }
                        >
                            {postObject.username}
                        </span>
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => likePost(e)}
                            className={`flex items-center gap-1 font-semibold transition-all ${
                                isLiked
                                    ? "text-coral"
                                    : "text-gray-400 hover:text-coral"
                            }`}
                        >
                            {isLiked ? (
                                <FavoriteIcon
                                    fontSize="small"
                                    style={{
                                        fill: "#D44D5C",
                                    }}
                                />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                            <span>{likesCount}</span>
                        </button>
                    </div>
                </div>
                {/* </Card> */}
            </div>

            <div className="w-full max-w-5xl">
                <Card className="shadow-md">
                    <label className="block text-sm font-semibold text-primaryBlue mb-3">
                        Add a Comment
                    </label>
                    <textarea
                        value={newComment}
                        placeholder="Share your thoughts..."
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                        className="w-full p-3 border-2 border-skyBlue rounded-lg focus:border-primaryBlue focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:ring-opacity-20 resize-none mb-3"
                        rows="4"
                    />
                    <Button
                        onClick={addComment}
                        className="flex-1 max-w-[200px] bg-primaryBlue text-white font-bold py-3 rounded-lg hover:opacity-90"
                        // gradientMonochrome="failure"
                    >
                        Add Comment
                    </Button>
                </Card>

                <div className="flex flex-col gap-4 mt-6">
                    {comments.length > 0 ? (
                        comments.map((comment, key) => {
                            return (
                                <Card
                                    key={key}
                                    className="shadow-md rounded-2xl p-4 mb-3"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Profile Photo */}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primaryBlue to-blue-900 border-2 border-white shadow flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="w-6 h-6"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                            </svg>
                                        </div>

                                        {/* Comment Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Header: username + delete */}
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-primaryBlue">
                                                    {comment.username}
                                                </span>

                                                {authState.username ===
                                                    comment.username && (
                                                    <IconButton
                                                        onClick={() =>
                                                            deleteComment(
                                                                comment.id,
                                                            )
                                                        }
                                                        size="small"
                                                        title="Delete comment"
                                                    >
                                                        <DeleteIcon className="text-red-400 hover:text-red-600" />
                                                    </IconButton>
                                                )}
                                            </div>

                                            {/* Comment Body */}
                                            <p className="text-gray-700 text-sm break-words leading-relaxed whitespace-pre-line">
                                                {comment.commentBody}
                                            </p>

                                            {/* Footer: like */}
                                            <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-100">
                                                <FavoriteIcon
                                                    fontSize="small"
                                                    style={{ fill: "#D44D5C" }}
                                                    className="cursor-default"
                                                />
                                                <span className="text-xs text-gray-400">
                                                    Like
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
