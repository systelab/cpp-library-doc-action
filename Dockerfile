FROM node:12

# Move to workspace folder
WORKDIR $GITHUB_WORKSPACE

# Install 3rd party dependencies
RUN npm install

# Compile typescript code
RUN npm run build

# Configure image entrypoint
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
