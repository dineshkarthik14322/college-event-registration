const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// MongoDB Atlas Connection String
const MONGODB_URI = 'mongodb+srv://collegeCluster:Dinesh%40123@collegecluster.cxlguqe.mongodb.net/collegeDB?appName=collegeCluster';

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        // Start the server only after a successful database connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// --- API ROUTES ---

// 1. GET: Fetch all registrations
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ eventDate: 1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST: Add a new registration
app.post('/api/registrations', async (req, res) => {
    const { studentName, eventName, department, eventDate } = req.body;

    const newRegistration = new Registration({
        studentName,
        eventName,
        department,
        eventDate
    });

    try {
        const savedRegistration = await newRegistration.save();
        res.status(201).json(savedRegistration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE: Delete a registration by ID
app.delete('/api/registrations/:id', async (req, res) => {
    try {
        const result = await Registration.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Registration not found' });
        res.json({ message: 'Registration deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. GET: Get total registration count
app.get('/api/registrations/count', async (req, res) => {
    try {
        const count = await Registration.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

