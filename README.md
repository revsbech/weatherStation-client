# Angular skeleton project

This repository can be used for quick bootstrapping new Angular applications. 

It is rougly based on angular-seed, but is refactored to use Grunt for compilation of JS files, and to use ui-route 
instead of ng router

## Running locally

### NPM
Clone the repository, and run npm install, then run nom start to start a local webserver on localhost:8080. Visit
the site in you browser on http://localhost:8080

Run grunt watch to watch compass and js files.
 
### Docker
 
Run docker-compose up to star an nginx webserver as a dockercontainer. Then attach to localhost (or you docker virtual 
machine) to access your site.

## Compiling JS and CSS
CSS and JS are compiled using Grunt. Files are concatened, so all js files are places in src/js. All .js files in this
folder (And all subfolders) are automatically included in your app. We use bower for js dependency management. 
Bower scripts needs to be manualle added to the Grundfile.js

We use compass for our CSS. The default grunt task includes compiling CSS.

## Docker
A simple docker/Dockerfile is included that copies (instead of mounting) all files. This can be used to package the app
as a finished docker container just runt docker builds -t pco/my-cool-all -f docker/Dockerfiles . 
