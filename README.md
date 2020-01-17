# Ngdatemask

ngdatemask - an input date mask directive to control input of dates

it supports dd, MM, yyyy as formats

it makes sure the day is between 1 and 31, the month between 1 and 12 and the year larger than 1895

it wont allow you to enter invalid date/month/year

it does not autofix dates, you have to handle that yourself (e.g. if one enters 31/02/2020 it wont change it)

NOTE: in order to get noticed when the mask is valid and get the value you can bind to the (change) event - it will be triggered when the mask becomes valid (the definition of valid in our case is for all the formats to have reached their lengths)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
