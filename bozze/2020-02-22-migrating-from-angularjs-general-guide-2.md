---
layout: post
title: "How to migrate from AngularJS. Step 1: from ES5 to ES6"
date: 2020-02-22
excerpt: "This is the diary of the step I'm performing to upgrade our frontend infrastructure from AngularJS to another framework"
comments: true
feature: /assets/img/post-image/angularjslogo.jpg
showFeature: false
---

## Step 3: Use ES6 Modules
When AngularJS was invented there was no dependency injection system so Angular has implemented its own. This system is white verbose, complex to use and does not permit to easily optimize the code. All the modern frameworks, like React, Angular or Vue have simple started to use ES6 modules. So in order to prepare our project to be upgraded we need to introduce the ES6 modules.

This change can be a bit tricky. Usually the AngularJS project builds are just a concatenation of all Javascript files, so there is no concept of import/export, all is global and there is no need to use a package bundler. If we decide to use ES6 Modules we need a package bundler, like Webpack.

#### Integrate Webpack in your old Gulp build phase
Webpack is a bundler, it takes an input file, called entrypoint, and, starting from this, reading its import, it start to bundle all the files into one. We cannot thinking of adding all the import/export statements into our project since it is too big to be performed in one step. So I decided to use this approch:

- I start to migrate to ES6 modules one component at a time.
- The exported component are imported into the modules file and, the module file becames an entrypoint.
- During this phase our project has several entry point, merged together using the standard file concatenation.

In code, I changed the files from this:

```javascript
(function(){
  myController.$inject = ['$rootScope', '$ionicModal', 'lodash']
  function  myController($rootScope, $ionicModal, lodash){
    const  vm = this;
    vm.someHandler = function(){
      vm.result = lodash.filter(...);
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
myController.$inject = ['$rootScope', '$ionicModal']

function  myController($rootScope, $ionicModal){
  const  vm = this;
  vm.someHandler = function(){
    vm.result = lodash.filter(...);
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
function uglifyFiles (files, done) {
    const { series } = require('gulp');
    let parallelDoneCallback = series(
        webpackEntryPoints.map(entrypoint => function() {
            return gulp.src(entrypoint)
            .pipe(webpack({}))
            .pipe(gulp.dest('tmp/dist/'));
        }),
    );
    parallelDoneCallback(function() {
        gulp.src(['tmp/dist/*.js'].concat(files).concat(templateCacheFile))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildName + '/js'))
        .on('end', function () {
            done();
            del('tmp/dist/*');
        });
    });

}
```
So Webpack gets the entrypoints, pack them in series, put the results into `tmp/dist` folder and the results are concatenated with all the other files as done before.

The only missing part is that we have to avoid to concatenate all the file processed by Webpack, so I decided to add `.new.js` suffix to all the files I changed with ES6 Modules and changed the Javascript file array from `['src/js/**/*.module.js', 'src/js/**/*!(.module).js']` to `['src/js/**/*.module.js', 'src/js/**/*!(.module).js', '!src/js/**/*.new.js']`, i.e. removing all the files that ends with `.new.js`.

# Use Class-based components
Now that we are able to use ES6 Modules, we have to start to think about how to refactor your application to use ES6 Classes. All the modern framework, indeed, uses JS Classes to define components. For example
  
React code looks like:

```javascript
class  Welcome  extends  React.Component {
  render() {
    return  <h1>Hello, {this.props.name}</h1>;
  }
}
```
Angular 2+ code looks like:
```javascript
@Component({
  selector:  'app-my-output',
  templateUrl:  'someFile.html',
})

export class MyOutputComponent {
  onEverySecond() { console.log('second'); }
  onEveryFiveSeconds() { console.log('five seconds'); }
}
```
