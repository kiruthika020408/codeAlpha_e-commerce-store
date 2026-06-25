const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/register-user", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register-user.html"));
});
app.get("/register-admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register-admin.html"));
});
app.get("/admin-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

app.use(express.static("public"));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});