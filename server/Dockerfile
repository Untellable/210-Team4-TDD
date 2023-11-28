FROM node:18

WORKDIR /usr/server/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10000
CMD ["node", "server.js"]

# docker build -t tdd/server .
# docker run -p 8080:10000 -d tdd/server