# 🚀 Employee Monitoring System - Backend Installation Guide

## সিস্টেম প্রয়োজনীয়তা

- **Node.js**: v14+ (সর্বোত্তম: v18+)
- **লোকাল JSON ডেটাবেজ**: v4.4+ (স্থানীয় বা Atlas ক্লাউড)
- **npm**: v6+
- **Operating System**: Windows, Mac, Linux

---

## ধাপ ১: প্রয়োজনীয় সফটওয়্যার ইনস্টল করুন

### A. Node.js ইনস্টল করুন

**Windows/Mac/Linux:**
```bash
# https://nodejs.org/ থেকে ডাউনলোড করুন
# বা Homebrew ব্যবহার করুন (Mac):
brew install node

# ইনস্টলেশন যাচাই করুন:
node --version
npm --version
```

### B. লোকাল JSON ডেটাবেজ ইনস্টল করুন

**অপশন ১: স্থানীয় লোকাল JSON ডেটাবেজ (সহজ)**
```bash
# Windows (Chocolatey)
choco install mongodb-community

# Mac
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb-org

# স্থানীয় লোকাল JSON ডেটাবেজ স্টার্ট করুন:
mongod
```

**অপশন ২: লোকাল JSON ডেটাবেজ (ক্লাউড - সুপারিশকৃত)**
1. https://www.mongodb.com/cloud/atlas এ যান
2. একটি ফ্রি অ্যাকাউন্ট তৈরি করুন
3. একটি নতুন ক্লাস্টার তৈরি করুন (M0 Free Tier)
4. Connection string কপি করুন
5. আপনার `.env` ফাইলে পেস্ট করুন

---

## ধাপ ২: প্রজেক্ট সেটআপ করুন

### ১. প্রজেক্ট ফোল্ডার তৈরি করুন
```bash
mkdir employee-monitoring-system
cd employee-monitoring-system
```

### ২. ফাইলগুলো রাখুন
```
employee-monitoring-system/
├── server.js
├── package.json
├── .env
├── .env.example
└── logs/ (তৈরি হবে স্বয়ংক্রিয়ভাবে)
```

### ३. npm ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

**আউটপুট দেখা যাবে:**
```
added 45 packages, and audited 46 packages in 15s
```

---

## ধাপ ३: পরিবেশ কনফিগারেশন (.env)

### `.env.example` কপি করুন

```bash
cp .env.example .env
```

### `.env` ফাইল সম্পাদনা করুন

**Windows (Notepad++):**
```
RIGHT-CLICK `.env` → Edit with Notepad++
```

**Mac/Linux (Terminal):**
```bash
nano .env
# অথবা
vim .env
```

### প্রয়োজনীয় সেটিংস:

#### A. লোকাল JSON ডেটাবেজ সংযোগ

**স্থানীয় লোকাল JSON ডেটাবেজ:**
```env
MONGODB_URI=./data/employee_monitoring.json
```

**লোকাল JSON ডেটাবেজ (ক্লাউড):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/employee_monitoring?retryWrites=true&w=majority
```

#### B. JWT সিক্রেট (খুবই গুরুত্বপূর্ণ!)

```bash
# টার্মিনালে এই কমান্ড চালান (32+ অক্ষরের র্যান্ডম স্ট্রিং)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# আউটপুট কপি করুন এবং .env-এ পেস্ট করুন:
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

#### C. ফ্রন্টেন্ড URL

```env
FRONTEND_URL=http://localhost:3000
# উৎপাদনে (Production):
# FRONTEND_URL=https://yourdomain.com
```

#### D. সম্পূর্ণ `.env` উদাহরণ:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=./data/employee_monitoring.json
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

FRONTEND_URL=http://localhost:3000

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

LOG_LEVEL=info
LOG_FILE=logs/server.log

DEFAULT_LINK_VALIDITY=60
MAX_ACTIVITY_LOG_DAYS=30
MAX_VOICE_RECORDING_DAYS=90
```

---

## ধাপ ४: সার্ভার চালু করুন

### ডেভেলপমেন্ট মোড (স্বয়ংক্রিয় রিলোড সহ)

```bash
npm run dev
```

**প্রত্যাশিত আউটপুট:**
```
╔════════════════════════════════════════╗
║   Employee Monitoring System Backend   ║
║════════════════════════════════════════║
║  🚀 সার্ভার চালু হয়েছে
║  📍 URL: http://localhost:5000
║  🗄️  Database: লোকাল JSON ডেটাবেজ
║  ⚡ WebSocket: Socket.io
╚════════════════════════════════════════╝
```

### প্রোডাকশন মোড

```bash
npm start
```

---

## ধাপ ५: সার্ভার টেস্ট করুন

### ব্রাউজারে পরীক্ষা করুন:

```
http://localhost:5000/health
```

**সফল রেসপন্স:**
```json
{
  "status": "✅ সার্ভার চালু আছে"
}
```

### curl দিয়ে টেস্ট করুন:

```bash
# ম্যানেজার রেজিস্ট্রেশন
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "আহমেদ আলী",
    "email": "admin@company.com",
    "password": "SecurePass123",
    "company": "আমার কোম্পানি"
  }'

# প্রত্যাশিত রেসপন্স:
{
  "message": "✅ নিবন্ধন সফল",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "manager": {
    "id": "64a2f3b1c8d9e0f1g2h3i4j5",
    "name": "আহমেদ আলী",
    "email": "admin@company.com"
  }
}
```

---

## ধাপ ६: ফ্রন্টেন্ড সংযুক্ত করুন

### ফ্রন্টেন্ড HTML ফাইল আপডেট করুন

`employee_monitoring_system.html` ফাইলের শুরুতে যোগ করুন:

```javascript
// ব্যাকেন্ড API URL
const API_URL = 'http://localhost:5000';
const API_TIMEOUT = 10000;

// API কল করার ফাংশন
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// লিংক জেনারেট করার সময় ব্যবহার করুন
async function generateLink() {
    const name = document.getElementById('employeeName').value.trim();
    const email = document.getElementById('employeeEmail').value.trim();
    const department = document.getElementById('department').value;
    const token = localStorage.getItem('managerToken');

    if (!name || !email || !department) {
        alert('অনুগ্রহ করে সমস্ত তথ্য পূরণ করুন');
        return;
    }

    try {
        const response = await apiCall(
            '/api/links/generate',
            'POST',
            { name, email, department },
            token
        );

        if (response.link) {
            const linkCode = response.link.code;
            const fullLink = `${window.location.origin}?link=${linkCode}`;
            
            // সফলতার বার্তা দেখান
            showNotification(`✅ লিংক তৈরি: ${linkCode}`);
            
            // লিংক কপি করার অপশন
            navigator.clipboard.writeText(fullLink);
            showNotification(`📋 সম্পূর্ণ লিংক কপি হয়েছে!`);
            
            // ফর্ম রিসেট করুন
            document.getElementById('employeeName').value = '';
            document.getElementById('employeeEmail').value = '';
            document.getElementById('department').value = '';
            
            // লিস্ট আপডেট করুন
            updateLinksList();
        }
    } catch (error) {
        showNotification('❌ লিংক তৈরিতে ত্রুটি: ' + error.message);
    }
}

// লিংক যাচাই করার সময় ব্যবহার করুন
async function activateLink() {
    const code = document.getElementById('linkCode').value.trim();

    if (!code) {
        alert('অনুগ্রহ করে লিংক কোড পেস্ট করুন');
        return;
    }

    try {
        const response = await apiCall(
            '/api/links/verify',
            'POST',
            { code }
        );

        if (response.sessionToken) {
            // সেশন টোকেন সংরক্ষণ করুন
            localStorage.setItem('sessionToken', response.sessionToken);
            localStorage.setItem('linkId', response.linkId);
            localStorage.setItem('employeeName', response.employeeName);

            // UI আপডেট করুন
            document.getElementById('employeeSection').style.display = 'block';
            document.getElementById('monitoringContent').style.display = 'flex';
            
            showNotification('✅ লিংক সক্রিয় হয়েছে!');
            
            // WebSocket সংযোগ শুরু করুন
            connectToWebSocket(response.linkId, response.employeeName);
        }
    } catch (error) {
        showNotification('❌ ' + error.message);
    }
}
```

---

## ধাপ ७: WebSocket সংযোগ (Real-Time Communication)

### Socket.io ক্লায়েন্ট যোগ করুন

HTML ফাইলে যোগ করুন:

```html
<!-- Socket.io লাইব্রেরি -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

<script>
    let socket = null;

    function connectToWebSocket(linkId, employeeName) {
        // Socket.io সংযোগ করুন
        socket = io('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        // সংযোগ সফল হলে
        socket.on('connect', () => {
            console.log('✅ WebSocket সংযুক্ত হয়েছে');
            
            // কর্মচারী জয়েন করুন
            socket.emit('employee-join', {
                linkId,
                employeeName
            });
        });

        // কমান্ড পাবেন
        socket.on('receive-command', (data) => {
            console.log('📤 ম্যানেজারের কমান্ড:', data.command);
            addActivity(`ম্যানেজার কমান্ড: ${data.command}`);
        });

        // ভয়েস স্ট্রিম পাবেন
        socket.on('voice-stream', (data) => {
            console.log('🎤 ভয়েস স্ট্রিম পাচ্ছি');
            // অডিও প্লে করার কোড এখানে যোগ করুন
        });

        // ডিসকানেক্ট হলে
        socket.on('disconnect', () => {
            console.log('❌ WebSocket ডিসকানেক্ট হয়েছে');
        });
    }

    // স্ক্রিনশট পাঠান
    function sendScreenshot(screenshotData) {
        if (socket && socket.connected) {
            socket.emit('screenshot', {
                linkId: localStorage.getItem('linkId'),
                screenshot: screenshotData,
                managerEmail: 'manager@email.com'
            });
        }
    }

    // ভয়েস ডেটা পাঠান
    function sendVoiceData(audioChunk) {
        if (socket && socket.connected) {
            socket.emit('voice-stream', {
                linkId: localStorage.getItem('linkId'),
                audioChunk: audioChunk,
                managerEmail: 'manager@email.com'
            });
        }
    }
</script>
```

---

## ধাপ ८: ট্রাবলশুটিং

### সমস্যা ১: "লোকাল JSON ডেটাবেজ সংযোগ ব্যর্থ"

```bash
# লোকাল JSON ডেটাবেজ চলছে কি না চেক করুন
mongod --version

# লোকাল JSON ডেটাবেজ স্টার্ট করুন
mongod

# বা Atlas URL চেক করুন:
# mongodb+srv://username:password@cluster.mongodb.net/
```

### সমস্যা २: "পোর্ট ৫০০০ ইতিমধ্যে ব্যবহৃত"

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# অথবা ভিন্ন পোর্ট ব্যবহার করুন
PORT=5001 npm start
```

### সমস্যা ३: "CORS Error"

```env
# .env এ FRONTEND_URL আপডেট করুন
FRONTEND_URL=http://localhost:3000
```

### সমস্যা ४: "JWT Token Error"

```bash
# নতুন সিক্রেট জেনারেট করুন
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# .env-এ যোগ করুন
JWT_SECRET=<generated_token>
```

---

## ধাপ ९: উৎপাদন স্থাপন (Deployment)

### Heroku-তে স্থাপন করুন:

```bash
# Heroku CLI ইনস্টল করুন
npm install -g heroku

# লগইন করুন
heroku login

# অ্যাপ তৈরি করুন
heroku create your-app-name

# লোকাল JSON ডেটাবেজ URL সেট করুন
heroku config:set MONGODB_URI=mongodb+srv://...

# JWT সিক্রেট সেট করুন
heroku config:set JWT_SECRET=your_secret_key

# পুশ করুন
git push heroku main

# লগ দেখুন
heroku logs --tail
```

### AWS/DigitalOcean এর জন্য:

```bash
# `.env` আপডেট করুন
NODE_ENV=production
PORT=80

# সার্ভার চালু করুন
npm start

# পটভূমিতে চালানোর জন্য PM2 ব্যবহার করুন
npm install -g pm2
pm2 start server.js --name "monitoring-system"
pm2 save
pm2 startup
```

---

## ধাপ १०: নিরাপত্তা চেকলিস্ট

- ✅ `.env` ফাইল `.gitignore`-এ যোগ করুন
- ✅ `JWT_SECRET` দীর্ঘ এবং জটিল করুন (32+ অক্ষর)
- ✅ লোকাল JSON ডেটাবেজ পাসওয়ার্ড শক্তিশালী রাখুন
- ✅ HTTPS ব্যবহার করুন (উৎপাদনে)
- ✅ CORS শুধুমাত্র বিশ্বস্ত ডোমেনের জন্য সীমিত করুন
- ✅ রেট লিমিটিং সক্ষম করুন
- ✅ নিয়মিত ব্যাকআপ নিন

---

## সাহায্য এবং সমর্থন

কোন সমস্যা হলে:
1. লগ ফাইল চেক করুন (`logs/server.log`)
2. কনসোল আউটপুট দেখুন
3. লোকাল JSON ডেটাবেজ সংযোগ যাচাই করুন
4. Node.js ভার্সন আপডেট করুন

---

## দ্রুত শুরু করার কমান্ড

```bash
# সবকিছু এক সাথে সেটআপ করুন
git clone your-repo
cd employee-monitoring-system
npm install
cp .env.example .env
# .env এডিট করুন
npm run dev
```

**অভিনন্দন! আপনার সার্ভার এখন চলছে!** 🎉
