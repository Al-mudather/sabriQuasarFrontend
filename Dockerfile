# Get nodejs 14 container
FROM node:14

# Create workdir app directory
WORKDIR /dashboard

# Copy all files to the app directory
COPY . .

# use yarn to install package.json stuff
RUN npm install

RUN npm install -g @quasar/cli

# build with quasar
RUN quasar build

EXPOSE 8090

CMD ["quasar", "serve", "-p", "8090", "/dashboard/website"]
