const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const port = 4005;
const app= express()

// mongoDB connection
mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.5xsehfc.mongodb.net/FinancialSys?retryWrites=true&w=majority&appName=Cluster0"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log(`The server is connected with the database`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});