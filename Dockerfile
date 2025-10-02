# Multi-stage build for smaller image
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm ci; fi

# Production stage
FROM node:16-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port (configurable via ENV)
EXPOSE 9090

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 9090) + '/', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)}).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server/app.js"]