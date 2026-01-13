# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Create temp directories for nginx running as non-root
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chgrp -R 0 /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chmod -R g+rwX /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Run as non-root user for OpenShift compatibility
RUN chgrp -R 0 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    chmod -R g+rwX /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    chown -R nginx:0 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Copy custom nginx configurations
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Change ownership of the app files
RUN chown -R nginx:0 /usr/share/nginx/html && \
    chmod -R g+rwX /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port 8080 (OpenShift compatible)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
