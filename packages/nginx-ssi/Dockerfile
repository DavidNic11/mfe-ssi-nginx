FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build


FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/

COPY --from=build /app/default.conf /etc/nginx/conf.d/

EXPOSE 8080

CMD ["nginx","-g","daemon off;"]