FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy your Prisma schema + other code
COPY prisma ./prisma
COPY . .

# Run Prisma generate so the correct Linux binaries are built
RUN npx prisma generate

# Then build your Next.js app
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
