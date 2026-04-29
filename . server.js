const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const DB_FILE = "database.json";

// Read DB
function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE));
}

// Write DB
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    let db = readDB();

    const userExists = db.users.find(u => u.username === username);
    if (userExists) {
        return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.users.push({ username, password: hashedPassword });

    writeDB(db);
    res.json({ message: "Registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let db = readDB();

    const user = db.users.find(u => u.username === username);
    if (!user) {
        return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
