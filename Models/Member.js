const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "firstName is required!"],
        },
        middleName: {
            type: String
        },
        lastName: {
            type: String,
            required: [true, "lastName is required!"],
        },
        fullName: {
            type: String,
            required: [true, "fullName is required!"],
        },
        age: {
            type: Number,
            required: [true, "fname is required!"],
        },
        birthDate: {
            type: Date,
            required: [true, "birthDate is required!"],
        },
        address: {
            type: String,
            required: [true, "address is required!"],
        },
        email: {
            type: String,
            required: [true, "email is required!"],
        },
    },
    { timestamps: true }
);

const membersModel = mongoose.model("members", memberSchema);

module.exports = membersModel;
