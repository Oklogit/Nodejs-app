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
            .get(`http://localhost:3000/posts/byId/${id}`, {
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
        axios.get(`http://localhost:3000/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios
            .post(
                "http://localhost:3000/comments",
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
            .delete(`http://localhost:3000/comments/${commentId}`, {
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
            .delete(`http://localhost:3000/posts/${id}`, {
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
                    "http://localhost:3000/posts/title",
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
                    "http://localhost:3000/posts/postText",
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
            "http://localhost:3000/likes",
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
                        Top Striker
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
                    className={`text-xl text-gray-700 leading-relaxed mb-6 p-4 rounded-lg ${
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
                                    className="border-l-4 border-l-skyBlue shadow-md transition-shadow"
                                >
                                    <div className="mb-3">
                                        <label className="text-sm font-semibold text-primaryBlue">
                                            {comment.username}
                                        </label>
                                    </div>
                                    <p className="text-gray-700 mb-4">
                                        {comment.commentBody}
                                    </p>
                                    {authState.username ===
                                        comment.username && (
                                        <Button
                                            color="failure"
                                            onClick={() =>
                                                deleteComment(comment.id)
                                            }
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    )}
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
