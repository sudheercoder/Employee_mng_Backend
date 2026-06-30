const express = require('express');
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, getDashboardStats } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');

const router = express.Router();

// Admin-only routes (require both auth + admin role)
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);
router.post("/create", authMiddleware, adminMiddleware, createEmployee);
router.get("/get", authMiddleware, adminMiddleware, getAllEmployees);
router.get("/get/:id", authMiddleware, adminMiddleware, getEmployeeById);
router.put("/update/:id", authMiddleware, adminMiddleware, updateEmployee);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteEmployee);

module.exports = router;