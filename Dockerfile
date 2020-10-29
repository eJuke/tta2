FROM node:12-alpine3.12

COPY . /tta2
WORKDIR /tta2
RUN yarn

ENTRYPOINT ["node", "tta2"]