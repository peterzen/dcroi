# Build image
FROM node:10.15.0

LABEL description="dcroi builder"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

USER root
WORKDIR /root

COPY ./ /root

RUN yarn install && yarn build


# Build server image
FROM nginx:alpine

LABEL description="dcroi"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

# copy document root
COPY --from=0 /root/dist/ /usr/share/nginx/html/

