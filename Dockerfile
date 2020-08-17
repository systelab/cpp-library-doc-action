FROM node:12

LABEL "com.github.actions.name"="Generate Documentation for C++ library"
LABEL "com.github.actions.description"="A GitHub Action / Docker image to run C++ library"

LABEL "repository"="https://github.com/systelab/cpp-library-doc-action"
LABEL "homepage"="https://github.com/systelab/cpp-library-doc-action"
LABEL "maintainer"="Quim Vila <jvila2@werfen.com>"

# Prepare OS to run Puppeteer
RUN  apt-get update \
     # See https://crbug.com/795759
     && apt-get install -yq libgconf-2-4 \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

# When installing Puppeteer through npm, instruct it to not download Chromium.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

# Copy action repository sources into container
COPY . .

# Install 3rd party dependencies
RUN npm install

# Configure image entrypoint
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
