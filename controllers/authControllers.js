

const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const { authenticateWithGoogle, authenticateRegister } = require("../utils/googleAuth");
const { sendToken } = require("../utils/sendtoken");


const registerNormalUser = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;
        console.log("Registering normal user:", req.body);
         
        // Check if email is already taken
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            type: type || 'USER', // Default to 'USER' if not provided
        });

        // Save user to the database
        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('❌ User Registration Failed:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const loginUserNormal = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        // Check if email is provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If the credentials match, return user info and possibly a JWT token
        // Here you might generate and return a JWT token for the session
         const token = sendToken(user);
        return res.status(200).json({
            message: "Login successful",
            user: user,
            token: token,  // Optionally return a JWT token for further requests
        });
    } catch (error) {
        console.error("❌ Login failed:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


/*const registerGoogleUser = async (req, res) => {
    try {
        const { googleId, name, email, image, type } = req.body;
        console.log("Registering user with Google:", req.body);

        // Check if Google ID is already registered
        const existingGoogleUser = await UserModel.findOne({ googleId });

        if (existingGoogleUser) {
            return res.status(400).json({ message: 'Google account is already registered' });
        }

        // Create a new Google user
        const newGoogleUser = new UserModel({
            googleId,
            name,
            email,
            image,
            type: type || 'USER', // Default to 'USER' if not provided
        });

        // Save the Google user to the database
        await newGoogleUser.save();

        return res.status(201).json({
            message: 'User registered with Google successfully',
            user: newGoogleUser,
        });
    } catch (error) {
        console.error('❌ Google User Registration Failed:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/

const googleLogin = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await authenticateWithGoogle(code);

        if (!result.success) {
            return res.status(500).json({ message: "Google authentication failed", error: result.error });
        }
      
        return res.status(200).json({
            message: "Success",
            user: result.objmaster,
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

module.exports = { googleLogin, userinfo , registerNormalUser , loginUserNormal };
