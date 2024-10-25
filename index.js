const express = require("express");
const fs = require("fs");
let users = require("./userdata.json"); // Use `let` so we can reassign `users`
const app = express();
const PORT = 8000;

// Middleware
app.use(express.json()); // Allows handling JSON payloads in requests
app.use(express.urlencoded({ extended: false }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// GET all users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// CRUD operations for individual user
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });

    Object.assign(user, body); // Update user data
    fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error updating user data" });
      return res.json({ status: "User updated successfully", user });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    users.splice(index, 1); // Remove user from array
    fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error deleting user" });
      return res.json({ status: "User deleted successfully", id });
    });
  });

// POST a new user
app.post("/api/users", (req, res) => {
  const body = req.body;
  const newUser = {
    ...body,
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
  };
  users.push(newUser); // Add new user to array

  fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Error adding user" });
    return res.json({ status: "User added successfully", user: newUser });
  });
});
