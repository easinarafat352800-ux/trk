# Employee Monitoring System - Docker Image

FROM node:18-alpine

# কর্মজীবী ডিরেক্টরি সেট করুন
WORKDIR /app

# পোর্ট এক্সপোজ করুন
EXPOSE 5000

# হেলথ চেক যোগ করুন
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# প্যাকেজ ইনস্টল করুন
RUN apk add --no-cache \
    curl \
    wget \
    bash

# ডিপেন্ডেন্সি ফাইল কপি করুন
COPY package*.json ./

# npm ডিপেন্ডেন্সি ইনস্টল করুন
RUN npm ci --only=production

# অ্যাপ্লিকেশন কপি করুন
COPY server.js ./

# লগ ডিরেক্টরি তৈরি করুন
RUN mkdir -p logs

# অ-রুট ব্যবহারকারী তৈরি করুন
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# মালিকানা পরিবর্তন করুন
RUN chown -R nodejs:nodejs /app

# nodejs ব্যবহারকারীতে স্যুইচ করুন
USER nodejs

# সার্ভার চালু করুন
CMD ["node", "server.js"]
