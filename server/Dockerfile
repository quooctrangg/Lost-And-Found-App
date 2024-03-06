FROM node:alpine AS development

WORKDIR /server 

COPY ./server/package*.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /server

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /server/dist ./dist

CMD ["node", "dist/main.js"]
