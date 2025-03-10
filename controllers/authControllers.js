

const UserModel = require("../models/UserModel");
const { authenticateWithGoogle } = require("../utils/googleAuth");


const googleLogin = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await authenticateWithGoogle(code);

        if (!result.success) {
            return res.status(500).json({ message: "Google authentication failed", error: result.error });
        }

        return res.status(200).json({
            message: "Success",
            user: result.user,
            token: result.token,
        });
    } catch (error) {
        console.error("❌ Google Login Failed:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



const userinfo = async (req, res) => {
    try {
        // ✅ Ensure `req.user` is available from authentication middleware
        if (!req.user) {
            return res.status(401).json({ message: "❌ Unauthorized: User not authenticated" });
        }

        const { _id, email } = req.user; // Extract `_id` & `email` from `req.user`

        // ✅ Check if user exists in DB with both `_id` and `email`
        const user = await UserModel.findOne({ _id, email }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "❌ User not found" });
        }

        //console.log("✅ Retrieved User:", user);

        return res.status(200).json({
            message: "✅ User info retrieved successfully",
            user,
        });
    } catch (error) {
        console.error("❌ Error fetching user info:", error.message);
        return res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
};

module.exports = { googleLogin, userinfo };
