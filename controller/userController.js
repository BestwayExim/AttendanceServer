const User = require('../schema/userSchema')
const bcrypt = require('bcrypt');
const { generateToken } = require('../jwt/generate')
const LateComing = require('../schema/lateComing')

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = await generateToken(user._id, '3h');
        return res.status(200).json({ message: "Login Successful", token });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const applyForLateComing = async (req, res) => {
    try {

        const user = req.user._id;
        let { date, time } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!date || !time) {
            return res.status(400).json({ message: "Date and Time are required" });
        }

        if (!dateRegex.test(date)) {
            return res.status(400).json({ message: "Invalid Date format. Use YYYY-MM-DD." });
        }

        if (!timeRegex.test(time)) {
            return res.status(400).json({ message: "Invalid Time format. Use HH:MM:SS." });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid Date value." });
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const dateTimeString = `${year}-${month}-${day}T${time}`;


        const arrivalDateTime = new Date(dateTimeString);
        if (isNaN(arrivalDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid Date and Time values." });
        }

        const newLateComing = new LateComing({
            userId: user,
            date: parsedDate.toISOString().split('T')[0],
            arrivalTime: arrivalDateTime,
            reason: 'Late Coming'
        });
        await newLateComing.save();


        return res.status(200).json({ message: "Late Coming Applied Successfully" });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    login, applyForLateComing
}