require("dotenv").config(); // ✅ Must be at the top

const express = require("express");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
require("./models/dbConnection"); // Ensure this runs

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware setup
app.use(express.json());

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
    );


// ✅ Use auth routes correctly
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
