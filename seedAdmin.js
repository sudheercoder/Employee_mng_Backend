const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ─── Admin Details - Yahan change karo ───────────────────────
const ADMIN = {
    name:     "Admin",
    email:    "admin@gmail.com",
    password: "Admin@123",
    role:     "admin"
};
// ─────────────────────────────────────────────────────────────

const { User } = require('./model/userModel');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Assignments';

async function seedAdmin() {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ Database connected: " + mongoURI);

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN.email });
        if (existing) {
            console.log("⚠️  Admin already exists with email:", ADMIN.email);
            process.exit(0);
        }

        const hashPassword = await bcrypt.hash(ADMIN.password, 10);
        await User.create({
            name:     ADMIN.name,
            email:    ADMIN.email,
            password: hashPassword,
            role:     'admin'
        });

        console.log("🎉 Admin created successfully!");
        console.log("   Email   :", ADMIN.email);
        console.log("   Password:", ADMIN.password);
        console.log("   Role    : admin");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

seedAdmin();
