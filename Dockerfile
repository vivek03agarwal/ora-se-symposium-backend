FROM node:latest
MAINTAINER Vamsi Ramakrishnan "vamsi.ramakrishnan@oracle.com"

RUN mkdir se-symposium-backend
WORKDIR se-symposium-backend


COPY . .
RUN npm install

COPY . .

USER node
EXPOSE 4000

CMD ["npm", "run", "start"]
