# 🔍 Employee Monitoring System - সম্পূর্ণ প্যাকেজ

একটি আধুনিক এবং নিরাপদ **কর্মচারী কার্যক্রম মনিটরিং সিস্টেম** যা One-Time Link এবং রিয়েল-টাইম ট্র্যাকিং সাপোর্ট করে।

---

## 🎯 প্রধান বৈশিষ্ট্য

### ✨ কোর ফিচার
- **One-Time Use Links** - প্রতিটি লিংক শুধুমাত্র একবার ব্যবহারযোগ্য
- **Real-Time Communication** - WebSocket এর মাধ্যমে তাৎক্ষণিক আপডেট
- **Activity Logging** - সম্পূর্ণ কার্যক্রম ট্র্যাকিং
- **Voice Communication** - মাইক্রোফোন সাপোর্ট
- **Screenshot Capture** - পর্দার ছবি নেওয়ার ক্ষমতা
- **Multi-User Dashboard** - একাধিক কর্মচারী পরিচালনা

### 🔒 নিরাপত্তা
- JWT-based Authentication
- Encrypted Data Storage
- Role-based Access Control
- Automatic Session Timeout
- লোকাল JSON ডেটাবেজ দিয়ে ডেটা পার্সিস্টেন্সি

### 📊 রিপোর্টিং
- Activity Reports
- Usage Statistics
- CSV/PDF Export
- Data Analytics

---

## 📁 ফাইল স্ট্রাকচার

```
employee-monitoring-system/
│
├── server.js                          # ব্যাকেন্ড সার্ভার
├── package.json                       # Node.js ডিপেন্ডেন্সি
├── .env.example                       # পরিবেশ ভেরিয়েবল টেমপ্লেট
├── .env                              # আপনার কনফিগারেশন (গিটইগনোর করুন)
│
├── frontend_with_backend.html        # উন্নত ফ্রন্টেন্ড (ব্যাকেন্ড সংযুক্ত)
├── employee_monitoring_system.html   # স্বতন্ত্র ফ্রন্টেন্ড (স্থানীয় স্টোরেজ)
│
├── INSTALLATION_GUIDE.md             # বিস্তারিত ইনস্টলেশন নির্দেশনা
├── README.md                         # এই ফাইল
└── logs/                             # সার্ভার লগ ফাইল
```

---

## 🚀 দ্রুত শুরু (২ মিনিট)

### ১. প্রয়োজনীয় সফটওয়্যার ইনস্টল করুন

```bash
# Node.js ডাউনলোড করুন
https://nodejs.org/

# লোকাল JSON ডেটাবেজ ডাউনলোড করুন (অথবা লোকাল JSON ডেটাবেজ ব্যবহার করুন)
https://www.mongodb.com/try/download/community
```

### २. প্রজেক্ট সেটআপ করুন

```bash
# প্রজেক্ট ফোল্ডার তৈরি করুন
mkdir employee-monitoring-system
cd employee-monitoring-system

# ফাইলগুলো রাখুন
# server.js, package.json, .env.example

# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# .env ফাইল তৈরি করুন
cp .env.example .env

# .env এডিট করুন এবং লোকাল JSON ডেটাবেজ URI সেট করুন
```

### ३. সার্ভার চালু করুন

```bash
# ডেভেলপমেন্ট মোড (অটো-রিলোড সহ)
npm run dev

# বা প্রোডাকশন মোড
npm start
```

### ४. ফ্রন্টেন্ড খুলুন

```
ব্রাউজার: http://localhost:3000
অথবা: ফাইল খুলুন frontend_with_backend.html
```

---

## 📖 বিস্তারিত গাইড

আরও বিস্তারিত ইনস্টলেশন নির্দেশনার জন্য দেখুন: **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)**

---

## 🎮 ব্যবহার করার ধাপ

### ম্যানেজার (আপনি)

```
1. লগইন করুন বা নিবন্ধন করুন
   └─ Email: admin@company.com
   └─ Password: securepass123

2. নতুন মনিটরিং লিংক তৈরি করুন
   └─ কর্মচারীর নাম: করিম আহমেদ
   └─ ইমেইল: karim@company.com
   └─ বিভাগ: বিক্রয়
   └─ "লিংক তৈরি করুন" ক্লিক করুন

3. লিংক কর্মচারীকে পাঠান
   └─ ইমেইল, WhatsApp, বা সরাসরি দিন

4. রিয়েল-টাইম কার্যক্রম মনিটর করুন
   └─ ড্যাশবোর্ডে সব আপডেট দেখুন
```

### কর্মচারী

```
1. লিংক খুলুন
   └─ ব্রাউজার বা মেসেজে লিংকে ক্লিক করুন

2. লিংক কোড পেস্ট করুন
   └─ "লিংক সক্রিয় করুন" ক্লিক করুন
   └─ এখন থেকে মনিটরিং শুরু

3. মাইক অপশন ব্যবহার করুন (বৈকল্পিক)
   └─ 🎤 বাটন ক্লিক করুন
   └─ ম্যানেজারের সাথে সরাসরি কথা বলুন
```

---

## 🔧 API এন্ডপয়েন্ট

### অথেন্টিকেশন

```bash
# রেজিস্ট্রেশন
POST /api/auth/register
{
  "name": "আহমেদ আলী",
  "email": "admin@company.com",
  "password": "SecurePass123",
  "company": "আমার কোম্পানি"
}

# লগইন
POST /api/auth/login
{
  "email": "admin@company.com",
  "password": "SecurePass123"
}
```

### লিংক ম্যানেজমেন্ট

```bash
# নতুন লিংক তৈরি করুন
POST /api/links/generate
Authorization: Bearer <token>
{
  "name": "করিম আহমেদ",
  "email": "karim@company.com",
  "department": "বিক্রয়"
}

# সব লিংক দেখুন
GET /api/links
Authorization: Bearer <token>

# লিংক যাচাই করুন (কর্মচারী)
POST /api/links/verify
{
  "code": "EMP-ABC123XYZ"
}
```

### কার্যক্রম লগিং

```bash
# কার্যক্রম লগ করুন
POST /api/activities/log
Authorization: Bearer <token>
{
  "linkId": "64a2f3b1c8d9e0f1g2h3i4j5",
  "activity": "ফটোশপ খোলা হয়েছে",
  "type": "screenshot",
  "data": { ... }
}

# সব কার্যক্রম দেখুন
GET /api/activities
Authorization: Bearer <token>
```

### রিপোর্টিং

```bash
# রিপোর্ট ডাউনলোড করুন
GET /api/reports/download
Authorization: Bearer <token>
```

---

## 🌐 WebSocket ইভেন্ট

```javascript
// ম্যানেজার সংযুক্ত হবে
socket.emit('manager-join', managerId);

// কর্মচারী সংযুক্ত হবে
socket.emit('employee-join', { linkId, employeeName });

// স্ক্রিনশট পাঠাবে
socket.emit('screenshot', { linkId, screenshot, managerEmail });

// কমান্ড পাঠাবে
socket.emit('send-command', { linkId, command, employeeName });

// মাইক্রোফোন টগল করবে
socket.emit('microphone-toggle', { linkId, active, employeeName });

// রিয়েল-টাইম কার্যক্রম আপডেট পাবে
socket.on('activity-update', (data) => {
    console.log(data.employeeName + ': ' + data.activity);
});
```

---

## 🗄️ ডাটাবেস স্কিমা

### Manager
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  company: String,
  createdAt: Date,
  settings: {
    enableScreenshot: Boolean,
    enableKeylogger: Boolean,
    enableVoice: Boolean,
    linkValidity: Number (minutes)
  }
}
```

### MonitoringLink
```javascript
{
  _id: ObjectId,
  managerId: ObjectId,
  code: String (unique),
  name: String,
  email: String,
  department: String,
  created: Date,
  expiresAt: Date,
  used: Boolean,
  usedAt: Date,
  status: String (active/used/expired)
}
```

### ActivityLog
```javascript
{
  _id: ObjectId,
  linkId: ObjectId,
  employeeName: String,
  activity: String,
  type: String (screenshot/keylog/voice/activity),
  data: Mixed,
  timestamp: Date (auto-delete after 30 days)
}
```

---

## 🔐 নিরাপত্তা সর্বোত্তম অনুশীলন

### ✅ করুন

- ✅ শক্তিশালী JWT সিক্রেট ব্যবহার করুন (32+ অক্ষর)
- ✅ HTTPS ব্যবহার করুন (উৎপাদনে)
- ✅ নিয়মিত ব্যাকআপ নিন
- ✅ এনভায়রনমেন্ট ভেরিয়েবল সুরক্ষিত রাখুন
- ✅ কর্মচারীদের সম্মতি নিন
- ✅ প্রাইভেসি নীতি বজায় রাখুন

### ❌ করবেন না

- ❌ কোডে পাসওয়ার্ড হার্ডকোড করবেন না
- ❌ `.env` ফাইল গিটে কমিট করবেন না
- ❌ সংবেদনশীল তথ্য লগ করবেন না
- ❌ অনুমোদন ছাড়া মনিটর করবেন না
- ❌ সংগৃহীত ডেটা শেয়ার করবেন না

---

## 🚨 আইনি বিজ্ঞপতি

এই সিস্টেম ব্যবহার করার আগে নিম্নলিখিত বিষয়গুলি নিশ্চিত করুন:

1. **কর্মচারীর সম্মতি** - লিখিত অনুমোদন নিন
2. **ডেটা সুরক্ষা** - স্থানীয় আইন মেনে চলুন
3. **গোপনীয়তা নীতি** - স্পষ্টভাবে যোগাযোগ করুন
4. **কর্মসংস্থান চুক্তি** - শর্তাদি অন্তর্ভুক্ত করুন
5. **নৈতিক ব্যবহার** - শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করুন

---

## 🐛 সমস্যা নির্ণয়

### লোকাল JSON ডেটাবেজ সংযোগ ব্যর্থ
```bash
# লোকাল JSON ডেটাবেজ চলছে কি না যাচাই করুন
mongod --version

# লোকাল JSON ডেটাবেজ স্টার্ট করুন
mongod

# অথবা .env এ সঠিক URI ব্যবহার করুন
```

### পোর্ট ইতিমধ্যে ব্যবহৃত
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# অন্য পোর্ট ব্যবহার করুন
PORT=5001 npm start
```

### WebSocket সংযোগ ব্যর্থ
```bash
# CORS সেটিংস চেক করুন (.env)
FRONTEND_URL=http://localhost:3000

# Socket.io লাইব্রেরি আপডেট করুন
npm update socket.io
```

---

## 📚 প্রয়োজনীয় লাইব্রেরি

```json
{
  "express": "ওয়েব ফ্রেমওয়ার্ক",
  "socket.io": "রিয়েল-টাইম কমিউনিকেশন",
  "mongoose": "লোকাল JSON ডেটাবেজ অডিএম",
  "jsonwebtoken": "অথেন্টিকেশন",
  "bcryptjs": "পাসওয়ার্ড এনক্রিপশন",
  "cors": "ক্রস-অরিজিন রিকোয়েস্ট",
  "dotenv": "পরিবেশ ভেরিয়েবল"
}
```

---

## 🌟 উন্নত বৈশিষ্ট্য (ভবিষ্যত)

- [ ] স্বয়ংক্রিয় স্ক্রিনশট ক্যাপচার
- [ ] কীলগার ট্র্যাকিং
- [ ] অ্যাপ্লিকেশন ট্র্যাকিং
- [ ] ইন্টারনেট ট্র্যাকিং
- [ ] পিসি জিপিএস লোকেশন
- [ ] দূরবর্তী পিসি রিবুট
- [ ] সফটওয়্যার ইনস্টলেশন প্রতিরোধ
- [ ] ওয়েবসাইট ব্লকিং

---

## 📞 সাপোর্ট এবং যোগাযোগ

### সমস্যার সমাধান
1. [Installation Guide](./INSTALLATION_GUIDE.md) চেক করুন
2. কনসোল লগ দেখুন
3. লোকাল JSON ডেটাবেজ সংযোগ যাচাই করুন
4. পোর্ট কনফ্লিক্ট চেক করুন

### লাইসেন্স
MIT License - আপনি স্বাধীনভাবে ব্যবহার করতে পারেন

---

## 🎓 শেখার সংস্থান

- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com
- **লোকাল JSON ডেটাবেজ**: https://docs.mongodb.com
- **Socket.io**: https://socket.io/docs
- **JWT**: https://jwt.io

---

## 🙏 অবদান

এই প্রজেক্টকে উন্নত করতে স্বাগতম! আপনার প্রস্তাব এবং উন্নতি জানান।

---

## 📝 পরিবর্তনপত্র

### v1.0.0 (২০২৬)
- ✅ মূল সিস্টেম চালু
- ✅ One-Time Link ফিচার
- ✅ WebSocket রিয়েল-টাইম আপডেট
- ✅ JWT অথেন্টিকেশন
- ✅ মাইক্রোফোন সাপোর্ট

---

**শুভকামনা! আপনার সিস্টেম এখন প্রস্তুত।** 🚀

তৈরি করেছেন: **Claude AI Assistant**  
সংস্করণ: **1.0.0**  
আপডেট: **অক্টোবর ২০২৬**
