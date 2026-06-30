const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Assignments';
mongoose.connect(mongoURI)
    .then(() => console.log("Database Connected to " + mongoURI))
    .catch((err) => console.log("Database Connection Error: " + err.message));

const userRoute = require('./routes/userRoute');
const employeeRoute = require('./routes/employeeRoute');
const departmentRoute = require('./routes/departmentRoute');

app.use('/api/auth', userRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/department', departmentRoute);

app.listen(PORT, () => {
    console.log(`Server is Running On Port ${PORT}`);
});