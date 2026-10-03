# 🐳 Docker দিয়ে Employee Monitoring System চালু করুন

Docker ব্যবহার করে **মাত্র ১ কমান্ডে** সম্পূর্ণ সিস্টেম চালু করুন!

---

## ✅ প্রয়োজনীয় জিনিস

### Docker ইনস্টল করুন

**Windows/Mac:**
- Docker Desktop ডাউনলোড করুন: https://www.docker.com/products/docker-desktop
- ইনস্টল করুন এবং চালু করুন

**Linux (Ubuntu):**
```bash
# Docker ইনস্টল করুন
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# ব্যবহারকারীকে docker গ্রুপে যোগ করুন (sudo ছাড়া চালাতে)
sudo usermod -aG docker $USER
newgrp docker

# ভেরিফাই করুন
docker --version
docker-compose --version
```

---

## 🚀 দ্রুত শুরু (একটি কমান্ড)

### ধাপ ১: ফাইলগুলো প্রস্তুত করুন

```bash
# প্রজেক্ট ফোল্ডার তৈরি করুন
mkdir employee-monitoring-system
cd employee-monitoring-system

# এই ফাইলগুলো রাখুন:
# - server.js
# - package.json
# - Dockerfile
# - docker-compose.yml
# - .dockerignore
```

### ধাপ २: সিস্টেম চালু করুন

```bash
# Docker Compose দিয়ে চালু করুন
docker-compose up -d

# অথবা নতুন ইমেজ বিল্ড করে চালু করুন
docker-compose up -d --build
```

### ধাপ ३: সার্ভার চেক করুন

```bash
# সার্ভার চলছে কি না দেখুন
docker-compose ps

# লগ দেখুন
docker-compose logs -f app

# লোকাল JSON ডেটাবেজ সংযোগ যাচাই করুন
docker-compose exec app curl http://localhost:5000/health
```

### ধাপ ४: সব কিছু থামান

```bash
# সবকিছু বন্ধ করুন
docker-compose down

# ভলিউম সহ সবকিছু ডিলিট করুন
docker-compose down -v
```

---

## 📦 কি চলছে?

```
┌─────────────────────────────────────┐
│    Docker Compose (একসাথে)         │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Node.js App (Port 5000)     │  │
│  │  ✅ Express Server           │  │
│  │  ✅ Socket.io                │  │
│  │  ✅ API Endpoints            │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  লোকাল JSON ডেটাবেজ (Port 27017)        │  │
│  │  ✅ ডেটা সংরক্ষণ             │  │
│  │  ✅ ইউজার তথ্য              │  │
│  │  ✅ লিংক এবং কার্যক্রম      │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 কাস্টমাইজেশন

### Docker Compose এ পরিবর্তন করুন

**`docker-compose.yml` এডিট করুন:**

```yaml
# লোকাল JSON ডেটাবেজ পাসওয়ার্ড পরিবর্তন করুন
environment:
  MONGO_INITDB_ROOT_PASSWORD: আপনার_নতুন_পাসওয়ার্ড

# JWT সিক্রেট পরিবর্তন করুন
JWT_SECRET: আপনার_দীর্ঘ_সিক্রেট_কী

# পোর্ট পরিবর্তন করুন (প্রয়োজন হলে)
ports:
  - "5001:5000"  # বাহ্যিক পোর্ট:অভ্যন্তরীণ পোর্ট
```

### এনভায়রনমেন্ট ভেরিয়েবল পরিবর্তন করুন

```bash
# .env.docker ফাইল তৈরি করুন
cp .env.example .env.docker

# এডিট করুন
nano .env.docker

# Docker Compose এ ব্যবহার করুন
# env_file:
#   - .env.docker
```

---

## 📊 কন্টেইনার ম্যানেজমেন্ট

### চলমান কন্টেইনার দেখুন

```bash
# সব কন্টেইনার দেখুন
docker ps

# বন্ধ কন্টেইনার সহ সব দেখুন
docker ps -a

# শুধু আমাদের প্রজেক্টের কন্টেইনার
docker-compose ps
```

### লগ দেখুন

```bash
# সব লগ রিয়েল-টাইমে দেখুন
docker-compose logs -f

# শুধু app লগ
docker-compose logs -f app

# শুধু লোকাল JSON ডেটাবেজ লগ
docker-compose logs -f mongodb

# শেষ ৫০ লাইন
docker-compose logs -f --tail=50
```

### কন্টেইনারে এক্সেস করুন

```bash
# Node.js কন্টেইনারে ঢুকুন
docker-compose exec app bash

# লোকাল JSON ডেটাবেজ CLI ব্যবহার করুন
docker-compose exec mongodb mongosh -u admin -p changeThis123!

# কমান্ড চালান
docker-compose exec app npm list
```

### কন্টেইনার পুনরায় চালু করুন

```bash
# শুধু app পুনরায় চালু করুন
docker-compose restart app

# সবকিছু পুনরায় চালু করুন
docker-compose restart

# নির্দিষ্ট কন্টেইনার পুনরায় বিল্ড করুন
docker-compose up -d --build app
```

---

## 🔍 সমস্যা নির্ণয়

### মনিবি পোর্ট ইতিমধ্যে ব্যবহৃত

```bash
# কোন প্রক্রিয়া পোর্ট ব্যবহার করছে তা খুঁজুন
lsof -i :5000

# পোর্ট মুক্ত করুন বা পরিবর্তন করুন
docker-compose.yml এ পরিবর্তন করুন:
ports:
  - "5001:5000"
```

### লোকাল JSON ডেটাবেজ সংযোগ ব্যর্থ

```bash
# লোকাল JSON ডেটাবেজ কন্টেইনার চলছে কি?
docker-compose ps mongodb

# লোকাল JSON ডেটাবেজ লগ দেখুন
docker-compose logs mongodb

# পুনরায় চালু করুন
docker-compose restart mongodb
```

### অনুমতি সমস্যা (Linux)

```bash
# Docker socket-এর জন্য অনুমতি দিন
sudo usermod -aG docker $USER

# নতুন শেল সেশনে লগইন করুন
exit
# নতুন টার্মিনাল খুলুন
```

### ডিস্ক স্থান পূর্ণ

```bash
# অব্যবহৃত ইমেজ এবং কন্টেইনার পরিষ্কার করুন
docker system prune -a

# সম্পূর্ণ পরিষ্কার (সতর্কতা: সবকিছু মুছবে)
docker system prune -a --volumes
```

---

## 📈 উৎপাদন স্থাপন

### Heroku এ স্থাপন করুন

```bash
# Heroku CLI ইনস্টল করুন
npm install -g heroku

# লগইন করুন
heroku login

# অ্যাপ তৈরি করুন
heroku create your-app-name

# Dockerfile ব্যবহার করার জন্য কনফিগার করুন
heroku stack:set container

# পুশ করুন
git push heroku main

# লগ দেখুন
heroku logs -t
```

### AWS EC2 এ স্থাপন করুন

```bash
# EC2 ইনস্ট্যান্সে SSH করুন
ssh -i your-key.pem ec2-user@your-ec2-ip

# Docker ইনস্টল করুন
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# আমাদের প্রজেক্ট ক্লোন করুন
git clone your-repo
cd employee-monitoring-system

# চালু করুন
sudo docker-compose up -d
```

### DigitalOcean এ স্থাপন করুন

```bash
# Droplet তৈরি করুন (Docker প্রি-ইনস্টল সহ)
# SSH করুন এবং চালান
docker-compose up -d
```

---

## 🔐 নিরাপত্তা টিপস (প্রোডাকশনের জন্য)

```yaml
# docker-compose.yml এ সংবেদনশীল ডেটা রাখবেন না
# বরং পরিবেশ ফাইল ব্যবহার করুন

services:
  app:
    env_file:
      - .env.production
    # কখনও .env ফাইল চেক ইন করবেন না!
```

**প্রোডাকশন .env:**
```bash
# উত্পাদনের জন্য সবকিছু পরিবর্তন করুন
NODE_ENV=production
JWT_SECRET=your-super-secret-key-production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
MONGO_INITDB_ROOT_PASSWORD=strong_secure_password_123!@#
```

---

## 💾 ব্যাকআপ এবং পুনরুদ্ধার

### লোকাল JSON ডেটাবেজ ডেটা ব্যাকআপ করুন

```bash
# লোকাল JSON ডেটাবেজ ডেটা এক্সপোর্ট করুন
docker-compose exec mongodb mongodump \
  -u admin -p changeThis123! \
  -o /data/db/backup

# বা হোস্ট মেশিনে
docker-compose exec mongodb mongodump \
  -u admin -p changeThis123! \
  --out=/backup
```

### ভলিউম ব্যাকআপ করুন

```bash
# লোকাল JSON ডেটাবেজ ভলিউম ব্যাকআপ করুন
docker run --rm -v monitoring-mongodb_data:/data \
  -v $(pwd)/backup:/backup \
  busybox tar czf /backup/mongodb_backup.tar.gz -C /data .
```

---

## 📝 উদ্ভিদ ফাইল

### `docker-compose.override.yml` (ডেভেলপমেন্ট)

```yaml
version: '3.8'
services:
  app:
    # ভলিউম মাউন্ট করুন (কোড পরিবর্তন সংরক্ষণ করবে)
    volumes:
      - ./server.js:/app/server.js
    # ডেভেলপমেন্ট মোডে চালু করুন
    environment:
      NODE_ENV: development
    command: npm run dev
```

---

## 🆘 দ্রুত সমাধান

```bash
# সবকিছু নতুন করে চালু করুন
docker-compose down -v && docker-compose up -d --build

# সমস্ত লগ পরীক্ষা করুন
docker-compose logs

# সার্ভার পরীক্ষা করুন
docker-compose exec app curl http://localhost:5000/health

# লোকাল JSON ডেটাবেজ পরীক্ষা করুন
docker-compose exec mongodb mongosh -u admin -p changeThis123! --eval "db.adminCommand('ping')"
```

---

## 🎓 শেখার সংস্থান

- **Docker**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **লোকাল JSON ডেটাবেজ Docker**: https://hub.docker.com/_/mongo
- **Node.js Docker**: https://hub.docker.com/_/node

---

**আপনার সিস্টেম এখন Docker-এ চলছে!** 🎉

সবকিছু প্রস্তুত? এখন ফ্রন্টেন্ড খুলুন: **http://localhost:3000**
