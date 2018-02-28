FROM node:alpine as builder
LABEL maintainer="yuyang@robo2025.com"

COPY program /opt/program

RUN cd /opt/program \
    # && npm install --registry=https://registry.npm.taobao.org \
    && npm install \
    && npm run build

FROM nginx:alpine

COPY --from=builder /opt/program/dist/ /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]





