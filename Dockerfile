# Get nodejs 22.23.1 container (matches local dev v22.23.1; app-vite v2 needs >=22.22)
FROM node:22.23.1

# Create workdir app directory
WORKDIR /frontend

# Copy all files to the app directory
COPY . .

RUN npm install -g @quasar/cli

EXPOSE 8090

CMD ["quasar", "serve", "-p", "8090", "/frontend/website"]
