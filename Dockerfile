FROM node:25-alpine3.22
LABEL application="web-auth-service"
WORKDIR /web-auth
ENV APPLICATION_PORT=8083
ENV APPLICATION_HOST=0.0.0.0
COPY . .
RUN npm install
EXPOSE ${APPLICATION_PORT}/tcp
CMD ["npm", "run", "start"]