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
  console.log(req.body); // Log the body for debugging
  const { firstName, lastName, email, jobTitle, gender } = req.body;
  if (!firstName || !lastName || !email || !jobTitle || !gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      jobTitle,
      gender,
    });
    console.log(newUser);
    return res.status(201).json({ msg: "User Created Successfully", newUser });
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
}

module.exports = {
  handelGetAllUsers,
  handelGetUserById,
  handelPatchUserById,
  handelDeleteUserById,
  handelCreateUser,
};
