const { Department } = require('../model/departmentModel');

exports.createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Department name is required" });
        }
        const exists = await Department.findOne({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ message: "Department already exists" });
        }
        const department = await Department.create({ name: name.trim() });
        return res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Department name is required" });
        }
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true }
        );
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.status(200).json({ message: "Department updated successfully", department });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
