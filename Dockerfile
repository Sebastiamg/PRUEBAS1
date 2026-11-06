FROM node:14.15.3-alpine AS build-stage
ARG ENV_APP # you could give this a default value as well
ENV NUXT_ENV=$ENV_APP
WORKDIR /app
COPY . .
# Prepare app for production
RUN npm install && \
    npm run generate

FROM macbre/nginx-brotli:latest
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/cloud_config/default.conf /etc/nginx/conf.d/default.conf
## From 'build' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]