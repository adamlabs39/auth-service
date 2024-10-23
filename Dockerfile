FROM node:19.5.0-alpine
LABEL application="web-auth-service"
WORKDIR /web-auth
ENV APPLICATION_PORT=8081
ENV APPLICATION_HOST=0.0.0.0
COPY . .
RUN npm install
EXPOSE ${APPLICATION_PORT}/tcp

CMD ["npm" , "run", "start"]