# =========================
# STAGE 1: Build
# =========================
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY tailwind.config.mjs ./

RUN npm install

COPY . .

RUN npm run build

# =========================
# STAGE 2: Production
# =========================
FROM node:18-alpine AS runner

WORKDIR /app

# ✅ Install tini, bash (required for PM2), pm2 and pm2-logrotate
RUN apk add --no-cache curl tini moreutils

# ✅ Create non-root user
RUN addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -D appuser

# ✅ Copy from builder
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# ✅ Prepare log directory
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# ✅ Switch to non-root user
USER appuser

EXPOSE 3000

# ✅ Tini entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# ✅ Start with logs
CMD ["sh", "-c", "npm start >> /app/logs/app.log 2>&1"]

