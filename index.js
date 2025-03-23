require("dotenv").config(); // ✅ Must be at the top

const express = require("express");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const Routercontact = require("./routes/contactRouter");
const winston = require('winston');
const logger = require("./config/logger");
const groupRouter = require("./routes/groupRouter");
const contactAssignGroupRouter = require("./routes/contactAssignGroupRouter");
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

// Your error-handling middleware
app.use((err, req, res, next) => {
    // Log the error message and stack trace using the logger from logger.js
    logger.error(`${err.message}\n${err.stack}`);

    // Send a generic response
    res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Use auth routes correctly
app.use("/auth", authRouter);
app.use("/contacts", Routercontact);
app.use("/groups", groupRouter);
app.use("/assigncontactgroup", contactAssignGroupRouter);

// For testing and debugging
app.get('/error', (req, res) => {
    // This will trigger an error that gets caught by the error-handling middleware
    throw new Error('This is a test error!');
});
  
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
