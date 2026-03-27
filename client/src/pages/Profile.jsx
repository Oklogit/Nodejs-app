import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import { AuthContext } from "../helpers/Context";
import { Button, Card } from "flowbite-react";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import profileBg from "../assets/profile-bg.jpg";
import { Dropdown, DropdownItem } from "flowbite-react";

function Profile() {
    let navigate = useNavigate();
    let { id } = useParams();
    const { authState } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [listofUserPosts, setListofUserPosts] = useState([]);
    const ismyProfile = authState.id === parseInt(id);
    const [createdAt, setCreatedAt] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:3000/auth/basicinfo/${id}`)
            .then((response) => {
                setUsername(response.data.username);
                console.log(response.data.createdAt);
                setCreatedAt(response.data.createdAt);
            });
        axios
            .get(`http://localhost:3000/posts/byuserId/${id}`)
            .then((response) => {
                setListofUserPosts(response.data);
                // console.log(response.data);
            });
    }, []);

    return (
        // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[50px]">
        //     {/* Profile Header */}
        //     <div className="px-8 py-6 bg-gradient-to-r from-primaryBlue to-blue-900 text-white flex justify-between items-center flex-wrap gap-4">
        //         <div className="flex-1">
        //             <h1 className="text-4xl font-bold">{username}</h1>
        //             <p className="text-skyBlue mt-2">
        //                 {listofUserPosts.length} post
        //                 {listofUserPosts.length !== 1 ? "s" : ""}
        //             </p>
        //         </div>
        //         {ismyProfile && (
        //             <Button
        //                 onClick={() => navigate(`/changepassword/${id}`)}
        //                 gradientMonochrome="failure"
        //             >
        //                 Change Password
        //             </Button>
        //         )}
        //     </div>

        //     {/* Posts Grid */}
        //     <div className="px-4 sm:px-6 lg:px-8 py-8">
        //         {listofUserPosts.length > 0 ? (
        //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //                 {listofUserPosts.map((value, key) => {
        //                     return (
        //                         <Card
        //                             key={key}
        //                             className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        //                             onClick={() => {
        //                                 navigate(`/post/${value.id}`);
        //                             }}
        //                         >
        //                             <div className="bg-gradient-to-r from-primaryBlue to-blue-900 p-4 -mx-6 -mt-6 mb-4 rounded-t-lg">
        //                                 <h3 className="text-xl font-bold text-white line-clamp-2">
        //                                     {value.title}
        //                                 </h3>
        //                             </div>

        //                             <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">
        //                                 {value.postText}
        //                             </p>

        //                             <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        //                                 <span className="text-sm text-gray-500">
        //                                     by{" "}
        //                                     <span className="font-semibold text-primaryBlue">
        //                                         {value.username}
        //                                     </span>
        //                                 </span>
        //                                 <div className="flex items-center gap-1 text-coral font-semibold">
        //                                     <FavoriteIcon fontSize="small" />
        //                                     <span>{value.Likes.length}</span>
        //                                 </div>
        //                             </div>
        //                         </Card>
        //                     );
        //                 })}
        //             </div>
        //         ) : (
        //             <div className="text-center py-16">
        //                 {/* <div className="text-6xl mb-4">📝</div> */}
        //                 <p className="text-xl text-gray-600">
        //                     No posts yet. <NoteAddIcon />
        //                     {ismyProfile
        //                         ? "Create your first post!"
        //                         : "Check back soon!"}
        //                 </p>
        //             </div>
        //         )}
        //     </div>
        // </div>
        <div className="min-h-screen mt-[50px] bg-gradient-to-br from-gray-50 to-gray-100 ">
            {/* Header Background with Profile Card */}
            <div
                className="relative bg-cover bg-center px-4 pt-8 pb-16"
                style={{
                    backgroundImage:
                        // "url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200')",
                        `url(${profileBg})`,
                }}
            >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                {/* Profile Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Profile Photo Circle */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primaryBlue to-blue-900 border-4 border-white shadow-lg flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-16 h-16"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                    </div>

                    {/* Username */}
                    <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
                        {username}
                    </h1>

                    {/* Change Password Button */}
                    {ismyProfile && (
                        <div className="mt-2 text-white flex items-center gap-2 cursor-pointer relative">
                            <SettingsIcon />
                            <Dropdown
                                label="User Settings"
                                inline
                                placement="right"
                            >
                                <DropdownItem
                                    className="p-[3px]"
                                    onClick={() =>
                                        navigate(`/changepassword/${id}`)
                                    }
                                >
                                    Change Password{" "}
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section - Overlapping Card */}
            <div className="px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primaryBlue">
                            {listofUserPosts.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">
                            Posts
                        </p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primaryBlue">
                            {listofUserPosts.reduce(
                                (sum, post) => sum + post.Likes.length,
                                0,
                            )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">
                            Likes
                        </p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primaryBlue">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                            })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">
                            Date Joined
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="px-4 sm:px-6 lg:px-8 py-3 mt-6">
                <h2 className="text-2xl font-bold text-primaryBlue mb-6">
                    {username}'s posts
                </h2>

                {listofUserPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listofUserPosts.map((value, key) => {
                            return (
                                <Card
                                    key={key}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => {
                                        navigate(`/post/${value.id}`);
                                    }}
                                >
                                    <div className="bg-gradient-to-r from-primaryBlue to-blue-900 p-4 -mx-6 -mt-6 mb-4 rounded-t-lg">
                                        <h3 className="text-xl font-bold text-white line-clamp-2">
                                            {value.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">
                                        {value.postText}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">
                                            by{" "}
                                            <span className="font-semibold text-primaryBlue">
                                                {value.username}
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-1 text-coral font-semibold">
                                            <FavoriteIcon fontSize="small" />
                                            <span>{value.Likes.length}</span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <NoteAddIcon
                            sx={{ fontSize: 64, color: "#9CA3AF", mb: 2 }}
                        />
                        <p className="text-xl text-gray-600 mb-4">
                            No posts yet.{" "}
                            {ismyProfile ? (
                                <>
                                    <span
                                        onClick={() => navigate("/Createpost")}
                                        className="text-primaryBlue font-semibold hover:underline cursor-pointer"
                                    >
                                        Create your first post
                                    </span>
                                    !
                                </>
                            ) : (
                                "Check back soon!"
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
