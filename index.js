const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userFile = 'users.json';

// রেজিস্ট্রেশন রাউট
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    let users = [];

    if (fs.existsSync(userFile)) {
        users = JSON.parse(fs.readFileSync(userFile, 'utf8'));
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).send("এই ইউজারনেম ইতিমধ্যে রেজিস্টার্ড!");
    }

    users.push({ username, password });
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
    res.send("রেজিস্ট্রেশন সফল হয়েছে!");
});

// লগইন রাউট
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!fs.existsSync(userFile)) {
        return res.status(400).send("কোনো রেজিস্টার্ড ইউজার পাওয়া যায়নি।");
    }

    const users = JSON.parse(fs.readFileSync(userFile, 'utf8'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.send("লগইন সফল হয়েছে! স্বাগতম " + username);
    } else {
        res.status(401).send("ভুল ইউজারনেম বা পাসওয়ার্ড!");
    }
});

app.listen(3000, () => {
    console.log("সার্ভার সফলভাবে পোর্ট ৩০ এ চালু হয়েছে!");
});
