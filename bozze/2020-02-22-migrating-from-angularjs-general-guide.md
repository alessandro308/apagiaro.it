---
layout: post
title: "How to migrate from AngularJS. Step 1: from ES5 to ES6"
date: 2020-02-22
excerpt: "This is the diary of the step I'm performing to upgrade our frontend infrastructure from AngularJS to another framework"
comments: true
feature: /assets/img/post-image/angularjslogo.jpg
showFeature: false
---

On September I joined <a href="https://www.domotz.com/">Domotz</a>, an international company that produces software to perform Remote Network Monitoring. We have a backend architecture written in Python and a frontend application that runs over AngularJS... Moreover without the support of ES6 syntax!

This is the diary of the step I'm performing to upgrade our frontend infrastructure to new technologies.

Let's start from begin. Small spoiler: this story is not ended yet.

## Step 1: Migrate from ES5 to ES6
If you use ES5 syntax for back compatibility with your system, you really should upgrade your system.

"What is the problem?" you may ask... With ES6 Syntax Javascript has become a real language:

- You can declare a variable within a scope (using `let`, `const` instead of `var`)
- You can remote closures in for loop using the `let` assignment
- You can use more readable functions, like `Array.includes` instead of `Array.indexOf() !== -1`
- You can use arrow functions, to maintain the code concisely and readable
and more useful stuff that I was using daily and I wasn't able to use anymore.

To migrate you should think about why you are using ES5. We were using ES5 so, wrongly, I started to investigate the possibility to transpile our code, i.e. write in ES6 Syntax but execute ES5, using Babel. This solution was working but the building time, especially during the development phase drastically increased. Going deeper in the problem analysis I just realized that we were using ES5 only because of unit test. They were executing using Karma as a test runner and PhantomJS as the browser. PhantomJS? Yeah, it is deprecated and supports only ES5! So we were using a less friendly syntax only because of the unit test! We moved to Chrome Headless, decreasing the execution time of our unit test and voilà, we don't need Babel anymore and our build process is even faster than before!

Why am I telling the story of how we upgraded ES6 Syntax? Because this is the first step to thinking about migration. Analyze your system, understand how your build process works and try to move one step at a time to be ready to migrate your technology stack. I approached the problem without a complete understanding of our code, so I introduced Babel, spent some times on integrating it in the building process for understanding that I have just to replace the browser that runs the tests.

## Step 2: Simply, use ES6
Migrating a framework is something hard. It requires to have a solid plan, especially for an application like the one I'm working on. Our application code counts more than 300K lines, and we can not plan to migrate all of them just in one week. So you should take time to permit your developer to become familiar with ES6 and, in the meanwhile, think about how to use ES6 modules.

