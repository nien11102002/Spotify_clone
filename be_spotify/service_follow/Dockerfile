FROM node:20

WORKDIR /root/service_follow

COPY package.json .

RUN yarn config set network-timeout 3000000

RUN yarn install

COPY . .

RUN yarn prisma generate --schema src/prisma/schema.prisma

RUN yarn run build

EXPOSE 8080

CMD ["yarn" ,"start:prod"]