FROM node:latest AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:latest
WORKDIR /app

COPY --from=build /app/package*.json /app/
RUN npm install --only=production

COPY --from=build /app/public /app/public/
COPY --from=build /app/server /app/server/
COPY --from=build /app/*.js /app/

ENV NODE_ENV production
EXPOSE 8080

CMD [ "npm", "run", "serve" ]
