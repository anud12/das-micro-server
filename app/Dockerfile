FROM node:12-alpine3.15
#Copy whole project
COPY ./ ./app/

#Run clean install then transpile
WORKDIR /app
RUN npm ci
RUN npm run build
#Move resulting js bundle
RUN cp ./dist/app.js ../app.js

WORKDIR /
RUN rm -r /app
RUN mkdir "/www"

VOLUME ["/www"]
EXPOSE 8081/tcp

ENTRYPOINT ["node", "app.js", "/www"]