ARG MONGO_VERSION=6.0.15
FROM docker.io/mongo:$MONGO_VERSION
RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js