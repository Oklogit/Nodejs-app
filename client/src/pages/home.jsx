import React from "react";
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../helpers/Context";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";

export const Home = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [listofPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/auth/login");
            return;
        }

        setLoading(true);
        Axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                setListOfPosts(response.data.postList);

                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    }),
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch posts:", error);
                if (error.response && error.response.status === 401) {
                    navigate("/auth/login");
                }
                setLoading(false);
            });
    }, []);

    const likePost = (postId, e) => {
        e.stopPropagation();
        Axios.post(
            `${import.meta.env.VITE_API_URL}/likes`,
            { PostId: postId },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            },
        ).then((response) => {
            setListOfPosts(
                listofPosts.map((post) => {
                    if (post.id === postId) {
                        if (response.data.liked) {
                            return { ...post, Likes: [...post.Likes, 0] };
                        }
                        return { ...post, Likes: post.Likes.slice(0, -1) };
                    } else {
                        return post;
                    }
                }),
            );
            if (response.data.liked) {
                setLikedPosts([...likedPosts, postId]);
            } else {
                setLikedPosts(likedPosts.filter((id) => id !== postId));
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-8">
            <div className="px-4 sm:px-6 lg:px-8 py-3 mt-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primaryBlue mb-2">
                        Latest Posts
                    </h1>
                    <p className="text-gray-600">
                        Explore and engage with the community
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primaryBlue"></div>
                    </div>
                ) : listofPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {listofPosts.map((value, key) => {
                            const isLiked = likedPosts.includes(value.id);
                            return (
                                <div
                                    key={key}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full rounded-lg border border-gray-200 bg-white shadow-md justify-between"
                                    onClick={() =>
                                        navigate(`/post/${value.id}`)
                                    }
                                >
                                    <div className="bg-gradient-to-r from-primaryBlue to-blue-900 p-4 mb-4">
                                        <h2 className="text-2xl font-bold text-white line-clamp-2">
                                            {value.title}
                                        </h2>
                                    </div>

                                    <p className="text-gray-700 text-lg mb-6 mx-4 break-all whitespace-pre-line  overflow-hidden line-clamp-3">
                                        {value.postText}
                                    </p>

                                    <div className="flex items-center justify-between p-3 px-4 border-t border-gray-200">
                                        <Link
                                            to={`/auth/basicinfo/${value.UserId}`}
                                            className="text-primaryBlue font-semibold hover:text-coral transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {value.username}
                                        </Link>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) =>
                                                    likePost(value.id, e)
                                                }
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
                                                <span>
                                                    {value.Likes.length}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-xl text-gray-600">
                            No posts yet. Be the first to create one!
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
};
