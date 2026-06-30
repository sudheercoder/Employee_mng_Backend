const express = require('express');
const {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');

const router = express.Router();

// Public for logged-in users (dropdown ke liye)
router.get('/get', authMiddleware, getAllDepartments);

// Admin-only CRUD
router.post('/create', authMiddleware, adminMiddleware, createDepartment);
router.put('/update/:id', authMiddleware, adminMiddleware, updateDepartment);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteDepartment);

module.exports = router;
