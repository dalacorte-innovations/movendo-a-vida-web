FROM node:21.6.2

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

COPY package.json package-lock.json ./

RUN bun install

EXPOSE 3033

CMD ["bun", "run", "dev"]