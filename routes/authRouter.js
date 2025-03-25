const express = require("express");
const { googleLogin, userinfo, registerUser, registerNormalUser, registerGoogleUser, loginUserNormal, updateUserProfile } = require("../controllers/authControllers");
const isAuthenticated = require("../middleware/verifytoken");

const authRouter = express.Router();

// ✅ Test route (to check if backend is running)
authRouter.get("/test", (req, res) => {
    res.json({ message: "Hello World1" });
});

// ✅ Use `POST` instead of `GET` for Google authentication
authRouter.post("/google", googleLogin);

authRouter.post("/normallogin", loginUserNormal);


authRouter.put("/updateprofile", isAuthenticated ,updateUserProfile);


//Normally users will register here
authRouter.post("/registernormal", registerNormalUser);

//Google user registration
//authRouter.post("/registergoogleuser", registerGoogleUser);

//Ftechnical User Data
authRouter.get("/user", isAuthenticated, userinfo);

module.exports = authRouter;
