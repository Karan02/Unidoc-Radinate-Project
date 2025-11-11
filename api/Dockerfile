FROM node:18

WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci --silent

# Copy the entire API (src, prisma, etc.)
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

# Run migrations, seed, then start NestJS API (container stays alive)
CMD ["bash", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run prisma:seed && exec npm run start:prod"]
