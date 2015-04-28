# tech.zalando

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

4. Edit the config-ENV.js file and fill in your credentials and configurations

5. Install Ruby (required by SASS)

6. run `gem install scss-lint`

7. run `gulp`

# Docker

Docker is used for deployment of the static site generator to AWS Beanstalk. You
can also use it for local development of course.

1. build docker container `docker build -t zalando/tfox .`
2. run app from docker container `docker run -i -p 8080:8080 -t zalando/tfox`.

   If you run docker in Virtualbox (e.g. boot2docker) you need to forward the
   port 4001 in virtualbox, too.

# Application Deployment

Deployment can be handled with AWS Beanstalk CLI tools
([Setup Instructions](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-getting-set-up.html)).

To deploy the current git HEAD with the CLI tools, run:
`eb deploy`

## Configuration
- The hosting environment needs to specify the following environment variables
  to deploy to S3: S3SECRET, S3REGION, S3KEY, S3BUCKET
- The port forwarding for the AWS Beanstalk load balancer is defined in `Dockerrun.aws.json`

# Deploying website

- When updating contents on prismic.io, a webhook triggers a new build of the
  public website through the integrated NodeJS application and corresponding
  gulp tasks.

- To generate and deploy the static website from your local machine manually,
  run `gulp deploy:dev`
