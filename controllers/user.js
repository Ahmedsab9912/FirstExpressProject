const User = require("../models/user");

async function handelGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

// Get User by ID

async function handelGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}

// Pathch User by ID

async function handelPatchUserById(req, res) {
  const body = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: body },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(270).json({ status: "User updated successfully", user });
}

// Delete User by ID

async function handelDeleteUserById(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  fs.writeFile("./userdata.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Error deleting user" });
    return res
      .status(200)
      .json({ status: "User deleted successfully", id: req.params.id });
  });
}

// Creating new User in DB

async function handelCreateUser(req, res) {
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

  return res.status(201).json({ msg: "User Created Success", result });
}

module.exports = {
  handelGetAllUsers,
  handelGetUserById,
  handelPatchUserById,
  handelDeleteUserById,
  handelCreateUser,
};
