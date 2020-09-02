# build environment
FROM node:13.12.0-alpine as build
ARG BUILD_VERSION
ARG BACKEND_URL
ENV REACT_APP_BUILD_VERSION "$BUILD_VERSION"
ENV REACT_APP_BACKEND_URL "$BACKEND_URL"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
