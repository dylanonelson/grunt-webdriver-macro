# grunt-webdriver-macro

> Grunt plugin for automating browser manipulation during front end development.

## Premise
Reduce repetitive manual refreshing and DOM interactions using Selenium webdriver 'macros,' configurable chunks of code that you can use to set up the state of your front end app. These macros can be edited and run in real time without leaving your terminal. For example, if you are writing code that affects a dropdown menu or modal, you can set up a macro to refresh the page and open the menu or modal with a click, then run that macro from a terminal window running the `grunt macro` process. If as you work you change the markup in your app, you can edit the macro file and have it reloaded without exiting the process.

### Goals
- Check front end changes without leaving the terminal
- Reduce repetitive manual browser interactions during development
- Write code for front end tests in parallel with features
- Structure front end work in a TDD-like but more flexible way

## Development checklist
- [x] Load macro definitions based on user config
- [ ] Dynamically reload macro definitions on file change

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-webdriver-macro --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-webdriver-macro');
```

## The "macro" task

### Overview
In your project's Gruntfile, add a section named `macro` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  macro: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.macroFile
Type: `String`

Path to the module which contains your macro definitions.
