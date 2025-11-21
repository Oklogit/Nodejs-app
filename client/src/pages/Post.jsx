import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3000/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });
    }, []);
    return <div>{postObject.postText}</div>;
}

export default Post;
