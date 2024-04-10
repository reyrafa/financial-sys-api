const Member = require("../Models/Member.js");
const multer = require("multer");
const xlsx = require("xlsx");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs-extra");
const upload = multer({ dest: "uploads/members/" });

// to avoid duplication of entry: added a validation to check if email is registered or not
const isMemberRegistered = async (request, response, next) => {
    const reqBody = request.body;

    const member = await Member.find({ email: reqBody.email });

    if (member.length > 0) {
        return response.status(400).json({
            insert: "Failed",
            message: "Member is already registered.",
        });
    }
    next();
};

// add member to the members collection
const addNewMember = async (request, response) => {
    const reqBody = request.body;
    try {
        const newMember = new Member({
            firstName: reqBody.firstName,
            middleName: reqBody.middleName,
            lastName: reqBody.lastName,
            fullName:
                reqBody.firstName +
                " " +
                reqBody.middleName +
                " " +
                reqBody.lastName,

            age: reqBody.age,
            birthDate: reqBody.birthDate,
            address: reqBody.address,
            email: reqBody.email,
        });
        await newMember.save();

        return response.status(201).json({
            insert: "Success",
            message: "Member is added successfully!",
        });
    } catch (error) {
        return response.status(500).json({
            error: "Internal Server Error",
        });
    }
};

// fetch members data
const fetchMembers = async (request, response) => {
    try {
        const members = await Member.find({});

        return response.status(200).json({
            fetch: "Success",
            members: members,
        });
    } catch (error) {
        return response.status(500).json({
            error: "Internal Server Error!",
        });
    }
};

// update members data
const updateMembers = async (request, response) => {
    const reqBody = request.body;
    try {
        const member = await Member.findOne({ _id: reqBody.memberId });
        if (!member) {
            return reseponse.status(404).json({
                update: "failed",
                message: "Member not found",
            });
        }
        const updateMemberInfo = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            middleName: reqBody.middleName,
            fullName:
                (reqBody.firstName ? reqBody.firstName : member.firstName) +
                " " +
                (reqBody.middleName ? reqBody.middleName : member.middleName) +
                " " +
                (reqBody.lastName ? reqBody.lastName : member.lastName),
            age: reqBody.age,
            birthDate: reqBody.birthDate,
            address: reqBody.address,
            email: reqBody.email,
        };
        const memberUpdate = await Member.findByIdAndUpdate(
            reqBody.memberId,
            updateMemberInfo
        );

        return response.status(200).json({
            update: "success",
            message: "Member updated Successfully",
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            error: "Internal Server Error!",
        });
    }
};

const importMembers = async (request, response) => {
    // Set up multer for file upload
    const upload = multer({ dest: "uploads/members/" }).single("file");

    try {
        upload(request, response, async (err) => {
            if (err) {
                return response.status(400).json({
                    message: "Error uploading file",
                    error: err.message,
                });
            }

            if (!request.file) {
                return response
                    .status(400)
                    .json({ message: "No file uploaded" });
            }

            const filePath = "uploads/members/" + request.file.filename;

            const workbook = xlsx.readFile(filePath);
            // first sheet on the excel, walay labot ang uban
            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            // Extract data from specific columns
            const data = [];
            let rowIndex = 2; //data start on 2nd row
            while (worksheet[`A${rowIndex}`]) {
                const firstName = worksheet[`A${rowIndex}`] ? worksheet[`A${rowIndex}`].v : '';
                const middleName = worksheet[`B${rowIndex}`] ? worksheet[`B${rowIndex}`].v : '';
                const lastName = worksheet[`C${rowIndex}`] ? worksheet[`C${rowIndex}`].v : '';
                const fullName = worksheet[`D${rowIndex}`] ? worksheet[`D${rowIndex}`].v : '';
                const age = worksheet[`E${rowIndex}`] ? worksheet[`E${rowIndex}`].v : '';
                const birthDate = worksheet[`F${rowIndex}`] ? worksheet[`F${rowIndex}`].v : '';
                const address = worksheet[`G${rowIndex}`] ? worksheet[`G${rowIndex}`].v : '';
                const email = worksheet[`H${rowIndex}`] ? worksheet[`H${rowIndex}`].v : '';


                data.push({
                    firstName,
                    middleName,
                    lastName,
                    fullName,
                    age,
                    birthDate,
                    address,
                    email,
                });
                rowIndex++;
            }

            // Insert data into MongoDB
            await Member.insertMany(data);

            fs.unlinkSync(filePath); // Remove uploaded file

            response.status(200).json({
                upload: "success",
                message: "Members uploaded successfully!",
            });
        });
    } catch (err) {
        console.error("Error uploading Excel file:", err);
        response.status(500).json({
            message: "Error uploading Excel file",
            error: err.message,
        });
    }
};

module.exports = {
    isMemberRegistered,
    addNewMember,
    fetchMembers,
    updateMembers,
    importMembers,
};
