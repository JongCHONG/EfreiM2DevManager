FROM node:20-alpine

ARG SERVICE_PATH
WORKDIR /app

COPY ${SERVICE_PATH}/package*.json ./
RUN npm install

COPY ${SERVICE_PATH} ./

CMD ["npm", "run", "start"]
