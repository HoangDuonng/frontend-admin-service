# Stage 0: Base image
FROM node:18-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Cài đặt pnpm trong stage này để có thể sử dụng lệnh `pnpm build`.
RUN npm install -g pnpm

# Bắt và truyền biến môi trường vào trong quá trình build
ARG NEXT_PUBLIC_KONG_GATEWAY_URL
ENV NEXT_PUBLIC_KONG_GATEWAY_URL=${NEXT_PUBLIC_KONG_GATEWAY_URL}

RUN pnpm build

# Stage 3: Production runner với dung lượng tối thiểu
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV NODE_ENV=production

# Đảm bảo biến môi trường được truyền vào lúc runtime
ENV NEXT_PUBLIC_KONG_GATEWAY_URL=${NEXT_PUBLIC_KONG_GATEWAY_URL}

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3001
CMD ["node", "server.js"]
