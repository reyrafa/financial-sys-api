const express = require("express");
const userController = require("../Controllers/userController.js");
const router = express.Router();

// route for user registration
router.post(
    "/register",
    userController.isUserExisting,
    userController.registerUser
);

// route for login 
router.post("/login", userController.loginUser)
module.exports = router;
