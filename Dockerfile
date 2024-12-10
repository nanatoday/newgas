FROM node:20-bullseye-slim

# install simple http server for serving static content
RUN npm install -g http-server
RUN npm install -g yarn --force

# bind your app to the gateway IP
ENV HOST=0.0.0.0

# make the 'app' folder the current working directory
WORKDIR /app


# copy 'package.json' to install dependencies
COPY package.json ./

# install dependencies
RUN yarn install

# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN yarn build

# delete all files except dist folder
RUN find /app -mindepth 1 ! -regex '^/app/dist\(/.*\)?' -delete

# expose port
EXPOSE 9000

CMD [ "http-server", "dist", "-p", "9000", "--proxy", "http://localhost:9000"]
