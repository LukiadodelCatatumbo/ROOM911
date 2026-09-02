FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack install --global pnpm@10.7.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_DEMO_USERNAME=
ARG VITE_DEMO_PASSWORD=
ARG VITE_SESSION_TIMEOUT_MINUTES=15
ARG VITE_SESSION_WARNING_MINUTES=1
ENV VITE_DEMO_USERNAME=${VITE_DEMO_USERNAME}
ENV VITE_DEMO_PASSWORD=${VITE_DEMO_PASSWORD}
ENV VITE_SESSION_TIMEOUT_MINUTES=${VITE_SESSION_TIMEOUT_MINUTES}
ENV VITE_SESSION_WARNING_MINUTES=${VITE_SESSION_WARNING_MINUTES}

RUN pnpm build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
