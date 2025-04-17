const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shiv@38", // Make sure this is correct
    database: "samvidhan"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database.");
    }
});

// 🚀 **Signup Route**
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    console.log("📩 Received Signup Request:", req.body); // Debugging

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, password], 
            (err, result) => {
                if (err) {
                    console.error("❌ Insert Error:", err);
                    return res.status(500).json({ error: "Error creating user" });
                }
                console.log("✅ User Registered Successfully");
                res.status(201).json({ message: "Signup successful! Please login." });
            }
        );
    });
});

// 🚀 **Login Route** (NEWLY ADDED)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("🔍 Checking login for:", username);

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            console.error("❌ Login Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("✅ Login Successful for:", username);
        res.status(200).json({ message: "Login successful!" });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server is running on port 5000");
});
