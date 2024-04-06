// model
const User = require("../Models/User.js");

// libraries
const bcrypt = require("bcrypt");

// checks if user is already added on our database using its company Id
const isUserExisting = async (request, response, next) => {
    const reqBody = request.body;
    try {
        // Checking if submitted company Id has match on our collection
        // user returns array
        const user = await User.find({ companyId: reqBody.companyId });

        // if naay match : failed
        if (user.length > 0) {
            return response.status(400).json({
                insert: "Failed",
                message: "User is already registered!",
            });
        }

        // if wala : proceed
        next();
    } catch (error) {
        response.status(500).json({ error: "Internal server error" });
    }
};

// register our user to User collection
const registerUser = async (request, response) => {
    const reqBody = request.body;
    try {
        const newUser = new User({
            companyId: reqBody.companyId,
            password: bcrypt.hashSync(reqBody.password, 10),
        });

        await newUser.save();

        return response.status(201).json({
            message: "User added successfully!",
            user: newUser,
        });
    } catch (error) {
        response.status(500).json({ error: "Internal server error" });
    }
};
const loggedUser = async (request, response) => {};

module.exports = { isUserExisting, registerUser, loggedUser };
