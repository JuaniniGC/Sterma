# Etapa 1: Compilar el panel
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite incrusta VITE_API_URL en el bundle al compilar. Railway pasa las
# variables del servicio como build args si están declaradas con ARG.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: Servir los estáticos con nginx
FROM nginx:1.27-alpine
# La imagen de nginx sustituye ${PORT} en las plantillas al arrancar
ENV PORT=8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
