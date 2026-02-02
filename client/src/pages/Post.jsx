import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });
        axios.get(`http://localhost:3000/comments/${id}`).then((response) => {
            console.log(response.data);
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
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                },
            )
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    const addedComment = { commentBody: newComment };
                    //this makes sure the new comment shows up without refreshing
                    setComments([...comments, addedComment]);
                    setNewComment("");
                    // console.log(comments);
                }
            });
    };
    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post">
                    <div className="title">{postObject.title}</div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">{postObject.username}</div>
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
                            <div key={key} className="comment">
                                {comment.commentBody}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
