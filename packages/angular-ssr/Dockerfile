FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app
RUN npm i
RUN npm run build:move

FROM node:18-alpine3.17

WORKDIR /app

COPY --from=build ./app .

EXPOSE 4000

CMD ["npm", "run", "serve:ssr:angular-ssr"]