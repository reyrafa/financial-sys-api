const express = require("express");
const memberController = require("../Controllers/memberController.js");
const auth = require("../auth.js");
const router = express.Router();

// route to add new member - only for authenticated user else return error
router.post(
    "/add",
    auth.verifyToken,
    memberController.isMemberRegistered,
    memberController.addNewMember
);

// route to fetch members
router.get("/fetch", auth.verifyToken, memberController.fetchMembers);

// route to update member information
router.put("/update", auth.verifyToken, memberController.updateMembers);

// route to import members information - only accepts excel
router.post("/upload", auth.verifyToken, memberController.importMembers);
module.exports = router;
