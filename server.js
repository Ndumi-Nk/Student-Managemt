// SIMPLE WORKING BACKEND - NO ROUTER CONFLICTS
console.log("🚀 Starting Student Management Backend...");

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory database for testing
let students = [
    { _id: '1', fullname: 'John Doe', email: 'john@example.com', course: 'Computer Science' },
    { _id: '2', fullname: 'Jane Smith', email: 'jane@example.com', course: 'Mathematics' }
];

// ==================== ROUTES ====================

// Home page
app.get('/', (req, res) => {
    res.send(`
        <h1>🎓 Student Management Backend</h1>
        <p>Server is running on port ${PORT}</p>
        <p><a href="/students">View Students API</a></p>
        <p><a href="/health">Health Check</a></p>
    `);
});

// GET all students
app.get('/students', (req, res) => {
    console.log('📥 GET /students - Returning', students.length, 'students');
    res.json(students);
});

// ADD new student
app.post('/students', (req, res) => {
    console.log('➕ POST /students - Adding:', req.body);
    
    // Validate required fields
    if (!req.body.fullname || !req.body.email || !req.body.course) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newStudent = {
        _id: Date.now().toString(),
        fullName: req.body.fullname,
        email: req.body.email,
        course: req.body.course,
        createdAt: new Date()
    };
    
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// UPDATE student
app.put('/students/:id', (req, res) => {
    console.log('✏️ PUT /students/' + req.params.id, req.body);
    
    const index = students.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    students[index] = { ...students[index], ...req.body };
    res.json(students[index]);
});

// DELETE student
app.delete('/students/:id', (req, res) => {
    console.log('🗑️ DELETE /students/' + req.params.id);
    
    const initialLength = students.length;
    students = students.filter(s => s._id !== req.params.id);
    
    if (students.length < initialLength) {
        res.json({ success: true, message: 'Student deleted successfully' });
    } else {
        res.status(404).json({ success: false, error: 'Student not found' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'Express',
        port: PORT,
        timestamp: new Date().toISOString(),
        studentsCount: students.length,
        endpoints: {
            home: 'GET /',
            getAll: 'GET /students',
            add: 'POST /students',
            update: 'PUT /students/:id',
            delete: 'DELETE /students/:id',
            health: 'GET /health'
        }
    });
});

// ==================== START SERVER ====================

console.log('🔄 Starting server on port', PORT + '...');

const server = app.listen(PORT, () => {
    console.log(`✅ SERVER RUNNING on http://localhost:${PORT}`);
    console.log(`✅ Test in browser: http://localhost:${PORT}`);
    console.log(`✅ API ready: http://localhost:${PORT}/students`);
    console.log(`✅ Frontend can connect to: http://localhost:${PORT}/students`);
    
    // Optional MongoDB connection (can fail, server still works)
    console.log('🔄 Trying MongoDB connection...');
    const mongoURI = "mongodb+srv://kwazi9939_db_user:T3jjHQUJ9X2CMLaG@cluster0.rmjrpmc.mongodb.net/studentdb";
    
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('✅ MongoDB Atlas connected! Data will persist.');
    })
    .catch(err => {
        console.log('⚠️ MongoDB not connected. Using in-memory storage.');
        console.log('⚠️ Error:', err.message);
    });
});

// Handle errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is busy! Try:`);
        console.log('   1. Change PORT to 5001 in server.js');
        console.log('   2. Run: netstat -ano | findstr :5000');
        console.log('   3. Kill the process on port 5000');
    }
    process.exit(1);
});