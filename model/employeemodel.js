const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    departments: { type: String, required: true },
    designation: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    defaultPassword: { type: String, default: "" }
}, { timestamps: true });

exports.Employee = mongoose.model("employee", employeeSchema);