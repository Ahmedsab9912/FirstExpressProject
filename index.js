/**
 * REST API for managing users
 * @module server
 * @requires express
 * @requires fs
 * @requires ./userdata.json
 */
const express = require("express");
const fs = require("fs");
let users = require("./userdata.json"); // Use `let` so we can reassign `users`
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = 8000;

// Connection to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
// Schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip}:${req.method}:${req.path}`,
    (err) => {
      return next();
    }
  );
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * GET all users
 */
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  res.setHeader("X-myName", "Ahmed Baig");
  return res.json(allDbUsers);
});

/**
 * CRUD operations for individual user
 */
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    const body = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(270).json({ status: "User updated successfully", user });
  })
  .delete(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error deleting user" });
      return res
        .status(200)
        .json({ status: "User deleted successfully", id: req.params.id });
    });
  });

/**
 * POST a new user
 */
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.jobTitle ||
    !body.gender
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    jobTitle: body.jobTitle,
    gender: body.gender,
  });
  console.log(result);

  return res.status(201).json({ msg: "Success", result });
});
