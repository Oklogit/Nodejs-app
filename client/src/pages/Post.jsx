import axios from "axios";
import { useState, useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/Context";
import { useNavigate } from "react-router-dom";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });
        axios.get(`http://localhost:3000/comments/${id}`).then((response) => {
            // console.log(response.data);

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
                    //this makes sure the new comment shows up without refreshing
                    setComments([...comments, addedComment]);
                    setNewComment("");
                    // console.log(comments);
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
                setComments(comments.filter((val) => val.id !== commentId)); //filter out the deleted comment from the comments array and update the state
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
    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post">
                    <div className="title">{postObject.title}</div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">
                        {postObject.username === authState.username ? (
                            <button onClick={() => deletePost(postObject.id)}>
                                delete
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        value={newComment}
                        placeholder="Comment..."
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="commentsList">
                    {comments.map((comment, key) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                                key={key}
                                className="comment"
                            >
                                <label htmlFor="">
                                    Username: {comment.username}
                                </label>
                                {comment.commentBody}
                                {authState.username == comment.username && (
                                    <button
                                        onClick={() =>
                                            deleteComment(comment.id)
                                        }
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
