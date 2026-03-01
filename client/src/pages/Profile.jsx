import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
    let { id } = useParams();
    const [username, setUsername] = React.useState("");
    const [listofUserPosts, setListofUserPosts] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/auth/basicinfo/${id}`)
            .then((response) => {
                console.log(response.data);
                setUsername(response.data.username);
            });
        axios
            .get(`http://localhost:3000/posts/byuserId/${id}`)
            .then((response) => {
                setListofUserPosts(response.data.listofUserPosts);
            });
    }, []);

    return (
        <div className="profilePageContainer">
            Profile
            <div className="basicInfo">
                <h1>{username}</h1>
            </div>
            <div className="listofPosts"></div>
        </div>
    );
}

export default Profile;
