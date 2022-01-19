# Get nodejs 14 container
FROM node:14

# Create workdir app directory
WORKDIR /frontend

# Copy all files to the app directory
COPY . .

RUN npm install -g @quasar/cli

EXPOSE 8090

CMD ["quasar", "serve", "-p", "8090", "/frontend/website"]
