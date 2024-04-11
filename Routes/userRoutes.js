const express = require("express");
const userController = require("../Controllers/userController.js");
const router = express.Router();
const auth = require("../auth.js");

// route for user registration
router.post(
    "/register",
    userController.isUserExisting,
    userController.registerUser
);

// route for login
router.post("/login", userController.loginUser);

// fetch logged user
router.get("/profile", auth.verifyToken, userController.fetchLoggedUser);
module.exports = router;
