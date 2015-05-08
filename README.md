# tech.zalando.de

# Core Components

Gulp: Build and deployment script
Closure Compiler: Compiles javascript files. (requires Java 7 or higher)
SASS: CSS Preprocessor
Metalsmith: Static website generator
Docker: Containers for consistent runtime environments
NodeJS: Application server to trigger static website builds via webhooks

# Development

## Setup

1. Install npm packages `npm install`

2. Install Java 7 or higher (required by Google Closure)

3. Copy and update the default config file `cp config.default.js config-ENV.js`
   (ENV needs to be replaced with the environment string, "dev", "qa" or "prod")

4. Edit the `config-ENV.js` file and fill in your credentials and configurations

5. Install Ruby (required by SASS)

6. run `gem install scss-lint`

7. run `gulp`. The environment needs to be specified via the `-e` option or
   `TFOX_ENV` environment variable.

# Deploying website

- To generate and deploy the static website from your local machine manually,
  run `gulp deploy`. The environment needs to be specified via the `-e` option or
  `TFOX_ENV` environment variable.

- For AWS-deployed builds: when updating contents on prismic.io, a webhook
  would trigger a new build of the public website through the integrated NodeJS
  application and corresponding gulp tasks.
