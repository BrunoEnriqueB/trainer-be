FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./prisma prisma

RUN npm config set registry https://registry.npmjs.org/
RUN npm i
RUN npx prisma generate

COPY . .

CMD ["npm", "start"]