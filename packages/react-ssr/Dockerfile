FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app
RUN npm i
RUN npm run build:client -- --base=http://localhost:5173/
RUN npm run build:server -- --base=http://localhost:5173/


FROM node:18-alpine3.17

WORKDIR /app

COPY --from=build ./app .

EXPOSE 5173

CMD ["npm", "run", "start"]