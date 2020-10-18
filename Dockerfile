FROM node:14.11.0 AS build

WORKDIR /build

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

FROM node:14.11.0

WORKDIR /guvnor

COPY --from=build /build/package.json .
COPY --from=build /build/yarn.lock .
COPY --from=build /build/dist/ ./dist/
COPY --from=build /build/node_modules/ ./node_modules/

RUN ls -al

ENTRYPOINT [ "yarn" ]
