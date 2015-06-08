# tech.zalando.de

# Core Components

Gulp: Build and deployment script
Closure Compiler: Compiles javascript files (requires Java 7 or higher)
SASS: CSS Preprocessor
Metalsmith: Static website generator
Docker: Containers for consistent runtime environments
NodeJS: Application server to trigger static website builds via webhooks



# Development

## Setup

1. Install npm packages `npm install`

2. Install Java 7 or higher (required by Google Closure)

3. Install the RST and MD converter tools with Pip and create an alias `rst2html`
   to match the Dockerized installation:

        sudo easy_install pip
        sudo pip install rst2html5
        sudo pip install markdown
        ln -s /usr/local/bin/rst2html5 /usr/local/bin/rst2html

   Make sure that you actually can run `rst2html` and `markdown_py` now. If you
   get a UTF-8 error, you may need to set the following environment variables:

        export LC_ALL=en_US.UTF-8
        export LANG=en_US.UTF-8

   NOTE: You shouldn't assume that the tools installed locally into development
   environment produce same output as the Dockerized version. For reliable
   testing, you would need to deploy from a real Docker container.

4. Copy and update the default config file `cp config.default.js config-ENV.js`
   (substitute ENV with either "dev", "qa", or "prod").

5. Edit the `config-ENV.js` file and fill in your credentials and configurations

   NOTE: You need all three environments configured before building the Docker
   image. See the project jobsite-generator-host README for more details.

6. Install Ruby (required by SASS).

7. Install SCSS linter by `gem install scss-lint`.

8. (Optional/OSX only) Get terminal-notifier by `brew install terminal-notifier`
   from https://github.com/alloy/terminal-notifier to get notifications on
   failed `gulp watch` builds.

9. npm install -g gulp

10. Go into project_root/lib/<lib_name>
npm install

11. Run `gulp`. The environment needs to be specified via the `-e` option or
   `TFOX_ENV` environment variable.


## Google Analytics config

Property IDs (to be set in config-ENV.js):

- Dev: `UA-62155512-1`
- QA: `UA-5362052-33`



# Deploying website

- To generate and deploy the static website from your local machine manually,
  run `gulp deploy`. The environment (dev/qa/prod) needs to be specified via
  the `-e` option or `TFOX_ENV` environment variable:

        gulp deploy -e dev
        TFOX_ENV=dev gulp deploy

- For AWS-deployed builds in QA or PROD: When updating contents on prismic.io or
  Github, a webhook on `POST /prismic-hook` or `POST /github-hook` triggers a
  new build of the public website through the integrated NodeJS application and
  the corresponding gulp `deploy` task. The build is also triggered every 30
  minutes anyway, to work around Greenhouse.io's lack of relevant webhooks.
