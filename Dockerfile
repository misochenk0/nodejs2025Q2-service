FROM node:24.11.1 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN npx prisma migrate deploy --schema prisma/schema.prisma

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV MIGRATE_RETRIES=12
ENV MIGRATE_DELAY=2

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "node dist/src/main.js"]