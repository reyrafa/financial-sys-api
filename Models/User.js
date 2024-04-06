const mongoose = require("mongoose");

// user Schema
const userSchema = mongoose.Schema(
    {
        companyId: {
            type: String,
            required: [true, "companyId is required!"],
        },
        password: {
            type: String,
            required: [true, "password is required!"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isEnabled: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
