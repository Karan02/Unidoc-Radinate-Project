FROM node:18
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]
