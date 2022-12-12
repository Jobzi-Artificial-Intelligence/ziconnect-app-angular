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
<!DOCTYPE html>
<head>
  ...
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization"></script>
</head>
```

## Run Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build. Visit https://angular.io/cli/build to see all available build options.

## Yarn/npm scripts

- `yarn run start`: runs the TypeScript compiler, asset copier, and a server at the same time, all three in "watch mode".
- `yarn run build`: runs the TypeScript compiler and asset copier once.
- `yarn run test`: builds the application and runs unit tests in "watch mode".
- `yarn run lint`: runs `eslint` on the project files.

### These are the continuous integration scripts:

- `yarn run ci:build-homolog`: runs the TypeScript compiler and asset copier once for homolog environment.
- `yarn run ci:build-production`: runs the TypeScript compiler and asset copier once for production environment.
- `yarn run ci:test`: builds the application and runs unit tests, generate code coverage report and uses Chrome Headless with "watch mode" off.
- `yarn run ci:lint`: runs `eslint` on the project files.

## Visual Studio Code

Is a source-code editor made by Microsoft with the Electron Framework, for Windows, Linux and macOS. Features include support for debugging, syntax highlighting, intelligent code completion, snippets, code refactoring, and embedded Git.

These are some of the extensions that help in the development process of this project:

- [Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2): This extension for Visual Studio Code adds snippets for Angular for TypeScript and HTML.
- [Prettier](https://prettier.io/): is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint into VS Code
