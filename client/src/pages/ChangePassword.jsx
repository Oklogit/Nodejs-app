import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Label, TextInput } from "flowbite-react";

function ChangePassword() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (oldPassword === newPassword) {
            setError("New password must be different from old password");
            return;
        }

        setLoading(true);

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.put(
                "http://localhost:3000/auth/changepassword",
                { oldPassword, newPassword },
                { headers: { accessToken } },
            );

            setMessage(response.data.message);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-[70px] flex justify-center items-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold text-primaryBlue text-center mb-6">
                    Change Your Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <Label
                            htmlFor="oldPassword"
                            value="Current Password"
                            className="block mb-2"
                        />
                        <TextInput
                            id="oldPassword"
                            type="password"
                            placeholder="Enter your current password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="newPassword"
                            value="New Password"
                            className="block mb-2"
                        />
                        <TextInput
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="confirmPassword"
                            value="Confirm New Password"
                            className="block mb-2"
                        />
                        <TextInput
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            gradientMonochrome="failure"
                            className="flex-1"
                        >
                            {loading ? "Changing..." : "Change Password"}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            color="gray"
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default ChangePassword;
