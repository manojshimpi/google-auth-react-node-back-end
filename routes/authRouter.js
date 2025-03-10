const express = require("express");
const { googleLogin, userinfo } = require("../controllers/authControllers");
const isAuthenticated = require("../middleware/verifytoken");

const authRouter = express.Router();

// ✅ Test route (to check if backend is running)
authRouter.get("/test", (req, res) => {
    res.json({ message: "Hello World1" });
});

// ✅ Use `POST` instead of `GET` for Google authentication
authRouter.post("/google", googleLogin);

authRouter.get("/user", isAuthenticated, userinfo);

module.exports = authRouter;
