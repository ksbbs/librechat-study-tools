FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3100

CMD ["node", "dist/index.js"]
