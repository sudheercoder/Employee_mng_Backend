const bcrypt = require('bcrypt');
const { Employee } = require('../model/employeemodel');
const { User } = require('../model/userModel');

const DEFAULT_PASSWORD = "Employee@123";

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, departments, designation, status } = req.body;
        if (!name || !email || !departments || !designation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "This email already has a login account" });
        }

        const employee = await Employee.create({ name, email, departments, designation, status, defaultPassword: DEFAULT_PASSWORD });

        const hashPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        await User.create({ name, email, password: hashPassword, role: 'employee' });

        return res.status(201).json({
            message: "Employee created successfully",
            employee,
            defaultPassword: DEFAULT_PASSWORD
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const { search, page, limit, sortBy, sortOrder } = req.query;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { name: searchRegex },
                { departments: searchRegex },
                { email: searchRegex },
                { designation: searchRegex }
            ];
        }
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const sortField = sortBy || "createdAt";
        const sortDirection = sortOrder === "asc" ? 1 : -1;
        const sort = { [sortField]: sortDirection };
        const total = await Employee.countDocuments(filter);
        const employees = await Employee.find(filter).sort(sort).skip(skip).limit(limitNum);
        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            employees,
            pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching employees", error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ message: "Employee fetched successfully", employee });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching employee", error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, departments, designation, status } = req.body;
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, departments, designation, status },
            { new: true }
        );
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ message: "Employee updated successfully", employee });
    } catch (error) {
        return res.status(500).json({ message: "Error updating employee", error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const departmentsData = await Employee.distinct("departments");
        const totalDepartments = departmentsData.length;
        const recentEmployees = await Employee.find().sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            success: true,
            stats: { totalEmployees, totalDepartments, recentEmployees }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching dashboard stats", error: error.message });
    }
};