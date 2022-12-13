FROM node:16
RUN apt-get update
RUN apt-get --assume-yes install postgresql-client
WORKDIR /app

EXPOSE 5000

CMD [ "npm", "run", "prod:mock" ]

COPY package.json .
RUN npm i --omit=dev

COPY . .