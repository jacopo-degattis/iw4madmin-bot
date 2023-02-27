FROM node:16.18.1-alpine3.16

RUN npm install --location=global npm && \
    npm install --location=global pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

RUN pnpm build && \
    rm -rf src node_modules pnpm-lock.yaml && \
    pnpm i --prod && pnpm store prune

CMD [ "pnpm", "start:prod" ]