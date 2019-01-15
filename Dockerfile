FROM nginx:alpine

LABEL description="dcroi"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

# copy document root
COPY dist/ /usr/share/nginx/html/

