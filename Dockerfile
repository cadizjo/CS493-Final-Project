FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=8000
ENV MYSQL_HOST=mysql-server-final
ENV REDIS_HOST=redis-server
EXPOSE ${PORT}
CMD [ "npm", "start" ]
