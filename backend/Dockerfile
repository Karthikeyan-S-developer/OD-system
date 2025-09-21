FROM node:20
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --silent
COPY . .
CMD ["npm", "run", "dev"]
