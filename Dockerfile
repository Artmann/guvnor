FROM node:14.11.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

ENTRYPOINT [ "yarn" ]
