const express = require("express");
const app = express();
const PORT = 8000;
const userRouter = require("./routes/user");
const { connectDB } = require("./connection");
const { logRegRes } = require("./middlewares");

//Connection

connectDB("mongodb://127.0.0.1:27017/youtube-app-1").then(() =>
  console.log("Connected to MongoDB")
);

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(logRegRes("log.txt"));

//Routes
app.use("/api/user", userRouter);

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
