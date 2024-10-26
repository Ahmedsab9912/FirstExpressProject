const express = require("express");

const router = express.Router();
const {
  handelGetAllUsers,
  handelGetUserById,
  handelPatchUserById,
  handelDeleteUserById,
  handelCreateUser,
} = require("../controllers/user");

/**
 * GET all users and POST new user
 */
router.route("/").get(handelGetAllUsers).post(handelCreateUser);

/**
 * CRUD operations for individual user
 */
router
  .route("/:id")
  .get(handelGetUserById)
  .patch(handelPatchUserById)
  .delete(handelDeleteUserById);

module.exports = router;
