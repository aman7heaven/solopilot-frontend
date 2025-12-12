# ============================================================================
# Stage 1: Build Stage
# ============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package management files from context root (solopilot-frontend)
COPY package.json package-lock.json ./

RUN npm ci --prefer-offline --no-audit

# Copy entire frontend source
COPY . .

RUN npm run build

# ============================================================================
# Stage 2: Production Stage
# ============================================================================
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=5173
EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + process.env.PORT, (r) => { if (r.statusCode !== 200) process.exit(1); }).on('error', () => process.exit(1));"

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
