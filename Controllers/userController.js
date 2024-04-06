// model
const User = require("../Models/User.js");

// libraries
const bcrypt = require("bcrypt");

// auth - for login
const auth = require("../auth.js");

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

// login user
const loginUser = async (request, response) => {
    const reqBody = request.body;

    try {
        // find the company Id on user collection
        const user = await User.findOne({ companyId: reqBody.companyId });

        // if not found return error
        if (!user) {
            return response.status(404).json({
                Login: "Failed!",
                message: `Company Id doesn't exist. Please Contact your administrator. `,
            });
        }

        // if found, check if password is correct
        const isPasswordCorrect = bcrypt.compareSync(
            reqBody.password,
            user.password
        );

        // if password is incorrect return error
        if (!isPasswordCorrect) {
            return response.status(401).json({
                login: "Failed",
                message: "You provided a wrong password. Please try again.",
            });
        }

        const token = auth.createAccessToken(user);
        return response.status(200).json({
            login: "Success",
            accessToken: token,
        });
    } catch (error) {
        response.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { isUserExisting, registerUser, loginUser };
