FROM node:19.5.0-alpine
LABEL application="web-auth-service"
WORKDIR /web-auth
ENV APPLICATION_PORT=${APPLICATION_PORT}
ENV APPLICATION_HOST=${APPLICATION_HOST}
COPY . .
RUN npm uninstall bcrypt
RUN npm install bcrypt
EXPOSE 8081/tcp

CMD ["npm" , "run", "start"]