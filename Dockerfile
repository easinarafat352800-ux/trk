FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

RUN mkdir -p /app/data /app/logs &&     addgroup -S appgroup && adduser -S appuser -G appgroup &&     chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3   CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/health', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["npm","start"]
