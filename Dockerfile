FROM node:20.20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Debug (opsional tapi sangat membantu)
RUN ls -R dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]