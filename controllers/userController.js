const bcrypt = require('bcrypt');
const { User } = require('../model/userModel');
const { Employee } = require('../model/employeemodel');
const jwt = require('jsonwebtoken');

exports.userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(401).json({ message: "Email already registered" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashPassword, role: 'employee' });
        return res.status(201).json({ message: "Registered Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid Email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid Password" });
        }
        if (user.role === 'employee') {
            const employee = await Employee.findOne({ email });
            if (employee && employee.status === 'Inactive') {
                return res.status(403).json({ message: "Your account is inactive. Contact admin." });
            }
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ message: "Login Successfully", token, role: user.role, name: user.name });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};