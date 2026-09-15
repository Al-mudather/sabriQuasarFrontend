# Get nodejs 22.23.1 container (matches local dev v22.23.1; app-vite v2 needs >=22.22)
FROM node:22.23.1

# Create workdir app directory
WORKDIR /frontend

# Install dependencies from the lockfile first so the layer is cached until
# package.json / package-lock.json change. This must run inside the image:
# a node_modules copied from the host goes stale the moment a dependency is
# added (e.g. libphonenumber-js) and the build fails with an unresolved import.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source (node_modules / dist are excluded via .dockerignore)
COPY . .

RUN npm install -g @quasar/cli

EXPOSE 8090

CMD ["quasar", "serve", "-p", "8090", "/frontend/website"]
