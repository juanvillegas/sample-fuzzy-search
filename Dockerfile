FROM node:12

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4444

CMD ["npm", "run", "dev"]
