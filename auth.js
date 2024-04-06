const jwt = require("jsonwebtoken");

const secret = "FilSys";
const User = require("./Models/User.js");

const createAccessToken = (user) => {
    const data = {
        id: user._id,
        isEnabled: user.isEnabled,
        isAdmin: user.isAdmin,
    };

    return jwt.sign(data, secret, {});
};

const verifyToken = (request, response, next) => {
    let token = request.headers.authorization;
    // console.log(token)

    if (token === undefined) {
        return response.send("No Token Provided");
    }
    token = token.slice(7, token.length);
    // console.log(token)
    jwt.verify(token, secret, (error, decodedToken) => {
        if (error) {
            return response.send({
                auth: "failed",
                message: error.message,
            });
        }
        // console.log(decodedToken);
        request.user = decodedToken;
        // console.log(request)
        next();
    });
};


const verifyAdmin = (request, response, next) => {
    if (!request.user.isAdmin) {
        return response.status(403).json({
            access: "Failed",
            message: "Action Forbidden!",
        });
    }
    next();
};

module.exports = {
    createAccessToken,
    verifyToken,
    verifyAdmin
};
