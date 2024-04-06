const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 4005;
const app = express();

// routes
const userRoutes = require("./Routes/userRoutes.js");

// mongoDB connection
mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.5xsehfc.mongodb.net/FinancialSys?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log(`The server is connected with the database`);
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/user", userRoutes);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
