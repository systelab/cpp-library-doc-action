FROM buildkite/puppeteer:5.2.1

# Copy action repository sources into container
COPY . .
RUN pwd

# Install 3rd party dependencies
RUN npm install

# Configure image entrypoint
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
