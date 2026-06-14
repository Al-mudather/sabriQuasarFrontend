# Get nodejs 22.18.0 container (matches local dev: v22.18.0)
FROM node:22.18.0

# Create workdir app directory
WORKDIR /frontend

# Copy all files to the app directory
COPY . .

RUN npm install -g @quasar/cli

EXPOSE 8090

CMD ["quasar", "serve", "-p", "8090", "/frontend/website"]
