// =====================================================
// Employee Monitoring System - Backend Server
// Node.js + Express + Socket.io
// =====================================================

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Manager, Employee, MonitoringLink, ActivityLog, VoiceRecording } = require('./local-db');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// পরিবেশ ভেরিয়েবল লোড করুন
dotenv.config();

// Express এবং Server সেটআপ
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ডিফল্ট হোমপেজ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_with_backend.html'));
});

// লোকাল ডেটাবেজ: ডেটা এই PC-র ./data/employee_monitoring.json ফাইলে থাকবে।
console.log('✅ লোকাল ডেটাবেজ প্রস্তুত (./data/employee_monitoring.json)');

// =====================================================
// DATABASE MODELS
// =====================================================
// Model definitions and persistent storage are handled by ./local-db.js.

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'টোকেন প্রয়োজন' });

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, manager) => {
        if (err) return res.status(403).json({ error: 'অবৈধ টোকেন' });
        req.manager = manager;
        next();
    });
};

// =====================================================
// API ROUTES
// =====================================================

// ১. ম্যানেজার রেজিস্ট্রেশন
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, company } = req.body;

        // চেক করুন ম্যানেজার আছে কি না
        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ error: 'ইমেইল ইতিমধ্যে নিবন্ধিত' });
        }

        // পাসওয়ার্ড হ্যাশ করুন
        const hashedPassword = await bcrypt.hash(password, 10);

        // নতুন ম্যানেজার তৈরি করুন
        const manager = new Manager({
            name,
            email,
            password: hashedPassword,
            company
        });

        await manager.save();

        // টোকেন তৈরি করুন
        const token = jwt.sign(
            { id: manager._id, email: manager.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '✅ নিবন্ধন সফল',
            token,
            manager: { id: manager._id, name: manager.name, email: manager.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ২. ম্যানেজার লগইন
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ম্যানেজার খুঁজুন
        const manager = await Manager.findOne({ email });
        if (!manager) {
            return res.status(400).json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল' });
        }

        // পাসওয়ার্ড যাচাই করুন
        const isPasswordValid = await bcrypt.compare(password, manager.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল' });
        }

        // টোকেন তৈরি করুন
        const token = jwt.sign(
            { id: manager._id, email: manager.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: '✅ লগইন সফল',
            token,
            manager: { id: manager._id, name: manager.name, email: manager.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ३. নতুন লিংক জেনারেট করুন (One-Time Use)
app.post('/api/links/generate', authenticateToken, async (req, res) => {
    try {
        const { name, email, department } = req.body;
        const managerId = req.manager.id;

        // ইউনিক কোড তৈরি করুন
        const code = 'EMP-' + crypto.randomBytes(8).toString('hex').toUpperCase();

        // এক্সপায়ারি টাইম সেট করুন
        const manager = await Manager.findById(managerId);
        const validity = manager.settings.linkValidity || 60;
        const expiresAt = new Date(Date.now() + validity * 60 * 1000);

        // লিংক তৈরি করুন
        const link = new MonitoringLink({
            managerId,
            code,
            name,
            email,
            department,
            expiresAt,
            status: 'active'
        });

        await link.save();

        res.status(201).json({
            message: '✅ লিংক তৈরি হয়েছে',
            link: {
                id: link._id,
                code: link.code,
                name: link.name,
                email: link.email,
                created: link.created,
                expiresAt: link.expiresAt,
                status: link.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ४. সব লিংক দেখুন
app.get('/api/links', authenticateToken, async (req, res) => {
    try {
        const managerId = req.manager.id;
        const links = await MonitoringLink.find({ managerId }).sort({ created: -1 });

        // স্ট্যাটাস আপডেট করুন (এক্সপায়ার হয়েছে কি না)
        const now = new Date();
        const updatedLinks = links.map(link => {
            if (!link.used && link.expiresAt < now) {
                link.status = 'expired';
                link.save();
            }
            return link;
        });

        res.json({
            links: updatedLinks,
            total: updatedLinks.length,
            active: updatedLinks.filter(l => !l.used && l.expiresAt > now).length,
            used: updatedLinks.filter(l => l.used).length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ५. লিংক ভেরিফাই করুন (কর্মচারী পক্ষ)
app.post('/api/links/verify', async (req, res) => {
    try {
        const { code } = req.body;
        const now = new Date();

        // লিংক খুঁজুন
        const link = await MonitoringLink.findOne({ code });

        if (!link) {
            return res.status(400).json({ error: '❌ বৈধ লিংক নয়' });
        }

        if (link.used) {
            return res.status(400).json({ error: '❌ এই লিংক ইতিমধ্যে ব্যবহার হয়েছে' });
        }

        if (link.expiresAt < now) {
            link.status = 'expired';
            await link.save();
            return res.status(400).json({ error: '❌ এই লিংকের মেয়াদ শেষ হয়েছে' });
        }

        // লিংক ব্যবহার করুন (One-Time Use)
        link.used = true;
        link.usedAt = now;
        link.usedBy = req.headers['user-agent'];
        link.status = 'used';
        await link.save();

        // সেশন টোকেন তৈরি করুন
        const sessionToken = jwt.sign(
            { linkId: link._id, employeeName: link.name },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '8h' }
        );

        res.json({
            message: '✅ লিংক সক্রিয় হয়েছে',
            sessionToken,
            linkId: link._id,
            employeeName: link.name,
            managerEmail: (await Manager.findById(link.managerId)).email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ६. কার্যক্রম লগ পাঠান
app.post('/api/activities/log', authenticateToken, async (req, res) => {
    try {
        const { linkId, activity, type, data } = req.body;

        const link = await MonitoringLink.findById(linkId);
        const manager = await Manager.findById(req.manager.id);

        const activityLog = new ActivityLog({
            linkId,
            employeeName: link.name,
            managerEmail: manager.email,
            activity,
            type,
            data
        });

        await activityLog.save();

        // WebSocket এর মাধ্যমে রিয়েল-টাইম আপডেট পাঠান
        io.to(`manager-${req.manager.id}`).emit('activity-update', {
            employeeName: link.name,
            activity,
            type,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });

        res.json({ message: '✅ কার্যক্রম লগ করা হয়েছে' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ७. সব কার্যক্রম দেখুন
app.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const managerId = req.manager.id;
        const links = await MonitoringLink.find({ managerId });
        const linkIds = links.map(l => l._id);

        const activities = await ActivityLog.find({ linkId: { $in: linkIds } })
            .sort({ timestamp: -1 })
            .limit(500);

        res.json({
            activities,
            total: activities.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ८. রিপোর্ট ডাউনলোড করুন
app.get('/api/reports/download', authenticateToken, async (req, res) => {
    try {
        const managerId = req.manager.id;
        const manager = await Manager.findById(managerId);
        const links = await MonitoringLink.find({ managerId });
        const linkIds = links.map(l => l._id);
        const activities = await ActivityLog.find({ linkId: { $in: linkIds } });

        const report = `
কর্মচারী মনিটরিং রিপোর্ট
কোম্পানি: ${manager.company}
জেনারেট করেছেন: ${manager.name}
তৈরির সময়: ${new Date().toLocaleString('bn-BD')}

========================================
সামারি
========================================
সক্রিয় লিংক: ${links.filter(l => !l.used && l.expiresAt > new Date()).length}
ব্যবহৃত লিংক: ${links.filter(l => l.used).length}
মোট কার্যক্রম: ${activities.length}

========================================
সমস্ত লিংক
========================================
${links.map(l => `
নাম: ${l.name}
ইমেইল: ${l.email}
বিভাগ: ${l.department}
স্ট্যাটাস: ${l.status}
তৈরির সময়: ${l.created.toLocaleString('bn-BD')}
`).join('\n')}

========================================
কার্যক্রম লগ
========================================
${activities.map(a => `
কর্মচারী: ${a.employeeName}
কার্যক্রম: ${a.activity}
ধরন: ${a.type}
সময়: ${a.timestamp.toLocaleString('bn-BD')}
`).join('\n')}
        `;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=monitoring_report.txt');
        res.send(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================================================
// WEBSOCKET EVENTS (Real-Time Communication)
// =====================================================

io.on('connection', (socket) => {
    console.log('🔗 নতুন ক্লায়েন্ট সংযুক্ত:', socket.id);

    // ম্যানেজার জয়েন করুন
    socket.on('manager-join', (managerId) => {
        socket.join(`manager-${managerId}`);
        console.log(`👨‍💼 ম্যানেজার সংযুক্ত: ${managerId}`);
    });

    // কর্মচারী জয়েন করুন
    socket.on('employee-join', (data) => {
        const { linkId, employeeName } = data;
        socket.join(`employee-${linkId}`);
        console.log(`👤 কর্মচারী সংযুক্ত: ${employeeName}`);

        // ম্যানেজারকে জানান
        io.emit('employee-connected', {
            employeeName,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });
    });

    // স্ক্রিনশট প্রেরণ
    socket.on('screenshot', (data) => {
        const { linkId, screenshot, managerEmail } = data;
        io.to(`manager-${managerEmail}`).emit('screenshot-received', {
            screenshot,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });
    });

    // ভয়েস/অডিও স্ট্রিম
    socket.on('voice-stream', (data) => {
        const { linkId, audioChunk, managerEmail } = data;
        io.to(`manager-${managerEmail}`).emit('voice-stream', {
            audioChunk,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });
    });

    // ম্যানেজার থেকে কমান্ড
    socket.on('send-command', (data) => {
        const { linkId, command, employeeName } = data;
        io.to(`employee-${linkId}`).emit('receive-command', {
            command,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });
        console.log(`📤 কমান্ড পাঠানো হয়েছে: ${employeeName}`);
    });

    // মাইক্রোফোন অ্যাক্টিভেশন
    socket.on('microphone-toggle', (data) => {
        const { linkId, active, employeeName } = data;
        io.emit('microphone-status', {
            employeeName,
            active,
            timestamp: new Date().toLocaleTimeString('bn-BD')
        });
    });

    // ডিসকানেক্ট
    socket.on('disconnect', () => {
        console.log('❌ ক্লায়েন্ট ডিসকানেক্ট:', socket.id);
    });
});

// =====================================================
// Health Check
// =====================================================

app.get('/health', (req, res) => {
    res.json({ status: '✅ সার্ভার চালু আছে' });
});

// =====================================================
// SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Employee Monitoring System Backend   ║
║════════════════════════════════════════║
║  🚀 সার্ভার চালু হয়েছে
║  📍 URL: http://localhost:${PORT}
║  🗄️  Database: Local JSON
║  ⚡ WebSocket: Socket.io
╚════════════════════════════════════════╝
    `);
});

module.exports = app;