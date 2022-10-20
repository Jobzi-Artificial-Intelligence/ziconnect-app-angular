
# Jobzi School Connectivity

## Setting up the local environment

This guide explains how to set up your local environment. It includes information about prerequisites, installation, build and running that app locally to verify your setup.

## Requirements  

### Node.js

For more information on installing Node.js, see nodejs.org. If you are unsure what version of Node.js runs on your system, run `node -v` in a terminal window.  

### npm package manager

To download and install npm packages, you need an npm package manager. This guide uses the npm client command line interface, which is installed with Node.js by default. To check that you have the npm client installed, run `npm -v` in a terminal window.

### Yarn

To install the Yarn, open a terminal window and run the following command:  

`npm install -g yarn`

### Angular Cli 

To install the Angular CLI, open a terminal window and run the following command:  

`npm install -g @angular/cli`

## Install package dependencies  

To install the all packages dependencies, open a terminal window, access application folder and run the following command:  

`yarn install`

## Loading the Google Maps API

- First follow [these steps](https://developers.google.com/maps/gmp-get-started) to get an API key that can be used to load Google Maps.
- The API key must be changed with your key before running the project.

```html
<!-- index.html -->
<!doctype html>
<head>
  ...
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization"></script>
</head>
```

## Run Development server  

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.  

## Build  

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build. Visit https://angular.io/cli/build to see all available build options.
