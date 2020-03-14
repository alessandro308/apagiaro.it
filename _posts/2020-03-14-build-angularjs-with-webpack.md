---
layout: post
title: "How to start to use to Webpack with a legacy file concatenation build"
date: 2020-03-14
excerpt: "Integrate Webpack in your actual build requires some analysis but it is possible. Here the solution I've found and implemented."
comments: true
feature: /assets/img/post-image/webpack-logo-small.png
showFeature: true
---
Migrating a huge application to a new framework is always difficult. In this post, I try to convince you that it is possible. This is the diary of the analysis I performed and the solution found to migrate a 300K+ lines of code application from AngularJS to a new framework. In this phase I didn't take account of a new framework since the work is huge I've chosen to postpone the new framework analysis.

## Step 1: Migrate from ES5 to ES6
The application I'm analyzing was written in ES5 syntax. What is the problem? It is harder to migrate it since all the examples you will find online use ES6 syntax and you have to convert it every time to understand how to use it. Moreover, with ES6 Syntax Javascript has become a real language:

- You can declare a variable within a scope (using `let`, `const` instead of `var`)
- You can remote closures in for loop using the `let` assignment
- You can use more readable functions, like `Array.includes` instead of `Array.indexOf() !== -1`
- You can use arrow functions, to maintain the code concise and readable
and more useful stuff...

In order to migrate, you should think about why you are using ES5. I started to investigate the possibility to transpile our code, i.e. write in ES6 Syntax but execute ES5, using Babel. I add Babel to our project and all was working but the building time, especially during the development phase drastically increased. Going deeper in the problem analysis I just realized that we were using ES5 only because of unit test. They were executing using Karma as a test runner and PhantomJS as the browser. PhantomJS is deprecated and supports only ES5! So we were using a less friendly syntax only because of unit test! We moved to Chrome Headless, decreasing the execution time of our unit test and voilà, we don't need Babel anymore and our build process is even faster than before!

Why do I tell the story of how we upgraded ES6 Syntax? Because this is the first step to thinking about migration. Analyze your system, understand how your build process works and try to move one step at a time to be ready to migrate your technology stack. I approached the problem without a complete understanding of our code, so I introduced Babel, spent some times on integrating it in the building process for understanding that I have just to replace the browser that runs the tests.

## Step 2: Simply, use ES6
Migrating a framework is something hard. It requires to have a solid plan, especially for an application like the one I'm working on. Our application code counts more than 300K lines, and we can not plan to migrate all of them just in one week. So you should take time to permit your developer to become familiar with ES6 and, in the meanwhile, think about how to use ES6 modules.

## Step 3: Use ES6 Modules
When AngularJS was invented there was no dependency injection system so Angular has implemented its own. This system is white verbose, complex to use and does not permit to easily optimize the code. All the modern frameworks, like React, Angular 2+ or Vue have simply started to use ES6 modules. So in order to prepare our project to be upgraded we need to introduce the ES6 modules.

This change can be a bit tricky. Usually, the AngularJS project builds are just a concatenation of all Javascript files, so there is no concept of import/export, all is global and there is no need to use a package bundler. If we decide to use ES6 Modules we need a package bundler, like Webpack.

#### Integrate Webpack in your old Gulp build phase
Webpack is a bundler, it takes an input file, called _entry-point_, and, starting from this, reading its import, it start to bundle all the files into one. We cannot think of adding all the import/export statements into our project since it is too big to be performed in one step. So I decided to use this approach:

- I start to migrate to ES6 modules one component at a time.
- The exported component is imported into the modules file and, the module file becomes an entry-point.
- During this phase, our project has several entry-points, merged together using the standard file concatenation.

In code, I changed the files from this:

```javascript
(function(){
  myController.$inject = ['someDep', 'otherDep', 'lodash']
  function  myController(someDep, otherDep, lodash){
    const  vm = this;
    vm.someHandler = function(){
      vm.result = lodash.sort(...);
    }
  }
  angular.module('app.myModule')
  .component('MyComponent', {
    templateUrl:  'someFile.html',
    controller:  myController,
  });
})();
```

to this:
```javascript
// In myComponent.js
import  lodash  from  'lodash';
myController.$inject = ['someDep', 'otherDep']

function  myController(someDep, otherDep){
  const  vm = this;
  vm.someHandler = function(){
    vm.result = lodash.sort(...);
  }
} 

export  default {
  templateUrl:  'someFile.html',
  controller:  myController,
};

// in myModule.module.js
import  myComponent  from  './myComponent';
angular.module('myModule', [])
.component('MyComponent', myComponent);
```
And changed the Gulp file from

```javascript 
const  gulp = require('gulp');
gulp.task('build', function (done) {
  return gulp.src(['tmp/dist/*.js'].concat(jsFiles))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(buildName + '/js'))
    .on('end', function () {
      done();
    });
});
```
to
```javascript
function minifyBuild (files, done) {
    const { series } = require('gulp');
    gulp.src(webpackEntryPoints)
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('tmp/dist/'))
    .on('end', function() {
        gulp.src(['tmp/dist/*.js'].concat(files).concat(templateCacheFile))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildName + '/js'))
        .on('end', function () {
            done();
            del('tmp/dist/*');
        })
    );
}
```
So Webpack gets the entrypoints, pack them in series, put the results into `tmp/dist` folder and the results are concatenated with all the other files as done before.

The only missing part is that we have to avoid to concatenate all the file processed by Webpack, so I decided to add `.es6.js` suffix to all the files I changed with ES6 Modules and changed the Javascript file array from `['src/js/**/*.js']` to `['src/js/**/*.js', '!src/js/**/*.es6.js']`, i.e. removing all the files that end with `.es6.js`.

Now our code can use ES6 modules, that means we can import modern frameworks using the syntax written on their documentation and we can think about how to integrate a new framework.