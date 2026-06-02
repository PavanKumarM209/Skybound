FROM node:18-alpine

WORKDIR /app

# Install dependencies first (leverages Docker caching)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]
