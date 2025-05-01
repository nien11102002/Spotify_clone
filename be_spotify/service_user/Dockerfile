FROM node:20

WORKDIR /root/service_user

COPY package.json .

RUN yarn config set network-timeout 3000000

RUN yarn install

COPY . .

RUN yarn prisma generate --schema src/prisma/schema.prisma

RUN yarn run build

EXPOSE 3030

CMD ["yarn" ,"start:prod"]