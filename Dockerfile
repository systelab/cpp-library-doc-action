FROM node:12

# Copy action repository sources into container
COPY . .
RUN pwd

# Install 3rd party dependencies
RUN npm install

# Compile typescript code
RUN npm run build

# Configure image entrypoint
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
