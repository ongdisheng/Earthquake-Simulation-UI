# Build Stage
FROM node:20-alpine AS build
ARG VITE_BACKEND_BASE_URL
ARG VITE_BACKEND_WEBSOCKET_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_WEBSOCKET_URL=$VITE_BACKEND_WEBSOCKET_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN chown -R node /app
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
