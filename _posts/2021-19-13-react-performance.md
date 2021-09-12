---
layout: post
title: "How to increase your React performance, with practical examples"
date: 2021-09-12
excerpt: "Create a high-performance application is a process. Here some tips you can use to create a better user experience."
comments: true
feature: /assets/img/post-image/react-performance.png
showFeature: true
---

One of the thing I like most React is the versatility. On the other hand, this versatility may result in an app that works correctly but doesn't run in the optimal way we expected because we applied some patterns that don't perform as we want and the user experience downgrades. 
In this post, we are going to see how can we improve our app performance by providing some daily based examples we can use in our app. 

## Table of contents
 - Code Splitting
 - Reduce CPU Usage
 - Reduce Renderings
 - Simplify Browser DOM
 - Reduce rendering because of Redux
 - Some tools from the future...

# Code Splitting
Each app that is not an example in the documentation is composed of several modules. Each module is a set of functionalities that are semantically similar and defined to work together. A module may depend on some other modules.

Anyway, not all the modules are every time used by an app. Suppose an app that shows a network topology and permits the user to download the device list in an Excel file. Probably most of the users never download the file and they only use the app to see the devices in the topology graph. So, why should we download the Excel library that may weigh several kilobytes (or even megabytes) when the user uses it very rarely? Including it in the application bundle, force the app to download all that codes before starting to render something useful on the screen and the user has to wait uselessly some extra seconds.

### How to fix
In order to fix it, we can use the *Code Splitting* technique. 
Thanks to the support of ES Modules this operation is even simpler than before:

```javascript
import('./my-huge-module.js')
.then(
  module => {
    // use the module
  },
  error => {
    // handle some load error
  },
)
```

We can use the code above to download the module only when we really need it. Moreover, if we don't care to consume some bandwidth and we use Webpack to build our app, we can use some [Webpack Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments) and prefetch that module so to reduce the waiting time required to use the lazy imported module. 
For instance, writing `/* webpackPrefetch: true */` Webpack outputs the script prefetch `<link/>` tag in the `index.html` asking the browser to prefetch that file and having it ready when required by our code.

```javascript
import('./my-huge-module.js')
// generate the following output in index.html
<link rel="prefetch" as="script" href="/js/1.chunk.js">
```

#### React supports it!
As you may notice, the previous paragraph was more related to Webpack than React. Let me explain why we are talking about that in a React blog post. 
Lazy Module Loading is natively supported by React using the [`<Suspense/>` API](https://reactjs.org/docs/react-api.html#reactsuspense):

```jsx
// generate-excel.js
import React from 'react'

function GenerateExcel() {
    return <div>🚀</div>
}

export default GenerateExcel

// app.js
import React from 'react'

const GenerateExcel = React.lazy(() => import('./generate-excel'))

function App() {
    return (
    <div>
        <React.Suspense fallback={<div>loading...</div>}>
          <GenerateExcel />
        </React.Suspense>
    </div>
    )
}
```


# Reduce CPU Usage
React Hooks are extremely useful. They unlock the full power of React Functional Component! 🚀
On other hand, they come with a cost. A functional component code is executed every time the component renders, downgrading the performance of our app without the right analysis and usage.

Is not the scope of this page to explain how to use every single hook. For this scope, there is a [well-written page](https://reactjs.org/docs/hooks-reference.html) in the official documentation. But we are going to talk only about the `useMemo` hook because is not always required and may be unknown to the newer React developers.

Let's start with an example. Here below is an example of a functional component. It generates a network map (using `computeMapOfTheEntireNetwork()` function, which is pretty expensive computation) and prints the outout using another component.

```
function NetworkMap({nodes, edges, nodesColor}) {
    const map = computeMapOfTheEntireNetwork(nodes, edges)
    return (
        <div>
            <Graph map={map} color={nodesColor} />;
        </div>;
    )
}
```

Every time this component has to render, it computes the entire map graph even if only the `nodesColor` prop has changed. As we may notice, we can avoid to re-compute the `map` if the colour only has changed because we expect that given the same `nodes` and `edges` the map remains the same.

### How to fix it
To achieve our performance improvement we can use the `useMemo` hook. 
As the official documentation says:
_`useMemo` accepts as parameters a “create” function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render._

Applying the hook to our code, we change the code as below. Now, every time the `nodes` or `edges` change our `map` is re-computed, otherwise, a memoized value is returns and the expensive computation is skipped.

```javascript
function DomotzNetworkMap({nodes, edges}) {
    const map = useMemo(
        () => computeMapOfTheEntireNetwork(nodes, edges),
    [nodes, edges]);
    return (
        <div>
            <Graph map={map} />
        </div>
    )
}
```

### There is a cheaper solution!
*Every line of code that is executed comes with a cost.* The only code that is performing always in an optimal way is the code that never runs. 
In our case, adding the `useMemo` hook we added a logic that, at each render, compares the array dependencies with the previous one and decide if the create function has to run or not.

Let's see an example of when is better to use another approach. In the code below we have a functional component that at each render re-create an object and pass it to a function (`expensiveNodesStuff`) that does something. 

```javascript
function ExampleMap() {
    const initialNodes = [
        'switch', 
        'router',
        'mobile',
        'laptop',
    ]
    const nodes = expensiveNodesStuff(initialNodes)
    // rest of the component
```

We can use the `useMemo` but there is a better solution. Supposing `expensiveNodesStuff` to be a pure function, we can move out of the component that code so to avoid running it at each render and also to add extra logic using the `useMemo` hook:

```javascript
const initialNodes = [
    'switch', 
    'router',
    'mobile',
    'laptop',
];
const nodes = expensiveNodesStuff(initialNodes)
function ExampleMap() {
    // rest of the component
```

# Reduce Useless Component Renderings
In React every component can re-renders because of three reasons:
 - `props` has been changed
 - `state` has been changed
 - parent component has re-rendered

In this paragraph, we are going to see how to avoid the re-renders when the parent does.
Supposing to have the code above in our app (sorry for the code complexity but we need several components to explain the scenario). 
We have a `DownloadExcelFile` that is just a `<button>` that when clicked run the handler. We have the `NetworkMap` component, which renders the map and finally a `MapView` component that puts together the previous components and shows to the user the status of the download request.

```javascript
function DownloadExcelFile({status, onClick}) {
    return <button onClick={onClick}>{count}</button>;
}
    
function NetworkMap({map}) {
    return (
        <Graph map={map}>
    )
}
    
function MapView({map}) {
    const [status, setStatus] = React.useState('')
    const triggerDownload = () => {/* Imagine a download function here;*/ setStatus('')}

    return (
        <div>
          <div>
              <DownloadExcelFile count={count} onClick={() => {
                  triggerDownload(); setStatus('Downloading')
                }} />
          </div>
          <div>
              <NetworkMap map={map} />
          </div>
          {status === 'Downloading' ? 'Preparing file' : null}
        </div>
    )
}
```
Keeping in mind when the component re-renders, let's analyse the code above.
In the beginning, all the code is rendered and ready to interact with our users. Then,
 - The user clicks the button.
 - The `onClick` is executed. 
 - The parent state is updated
 - The parent re-renders
 - Each child is asked to re-renders
 - The `<DownloadExcelFile>` component re-renders
 - The `<NetworkMap>` component re-renders! 

Of course, there was no reason to re-render the `<NetworkMap>` component since the map has not been changed. 

### How to fix it
In order to fix it, we can use `React.memo` (that is *not* the `useMemo` hook) if we have a functional component or the `React.PureComponent` if we are using the class component.
As the official documentation says: "If your component renders the same result given the same props, you can wrap it in a call to React.memo for a performance boost in some cases by memoizing the result. This means that React will skip rendering the component, and reuse the last rendered result."

```javascript
function DownloadExcelFile({status, onClick}) {
    return <button onClick={onClick}>{count}</button>;
}
    
const NetworkMap = React.memo(function({map}) {
    return (
        <Graph map={map}>
    )
})
    
function MapView({map}) {
    const [status, setStatus] = React.useState('')
    const triggerDownload = () => {/* Imagine a download function here;*/ setStatus('')}

    return (
        <div>
          <div>
              <DownloadExcelFile count={count} onClick={() => {
                  triggerDownload(); setStatus('Downloading')
                }} />
          </div>
          <div>
              <NetworkMap map={map} />
          </div>
          {status === 'Downloading' ? 'Preparing file' : null}
        </div>
    )
}
```

Applying the changes to the `<NetworkMap>` component as above, clicking on the button the `<NetworkMap>` doesn't re-renders until the props remain the same.

# Simplify Browser DOM

[According to Google](https://web.dev/dom-size/#recommendations) a web page should contains:
- Have no more than 1,500 nodes total.
- Have a depth smaller than 32 nodes.
- Have a parent node with no more than 60 child nodes.

Our apps sometimes exceed those (soft) limits because of large lists that render thousand DOM nodes in a box. 

### How to fix
To avoid it, we can use a technique called _list virtualization_ or _recycle view list_ that limits the number of nodes in the DOM with the help of some javascript.
The idea is that the user only sees some nodes at the same time so there is no needs to render all the items (most of each hidden by the scroll) but renders only the visible items and renders the other little by little the user scrolls the list.

I don't want to spend too much time on that section providing codes that can be easily found online. The [official documentation](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists) suggests [React-Window](https://github.com/bvaughn/react-window). I used that library, is easy to use and well-documentated. 

# Reduce rendering because of Redux
In many apps, React is often used with Redux, the most used Predictable State Container. 
One thing that not all the developers know is every time you dispatch an action, you are triggering a render!

A code like the code below triggers one render for each node. There are several ways to optimize that code, maybe the most fruitful is to create an action able to add several nodes at the time but, supposing for some other design decision we cannot do that or we have to dispatch several actions a the time, *we force a render at every dispatch*.

```javascript
function NetworkMap({id}){
   useEffect(() => {
     fetchMap(id)
     .then(({nodes}) => {
       for(let node of nodes){
          store.dispatch({type: 'ADD_NODE', node: node})
       }
     })
   })
}
```
### How to fix it
To avoid it, we can wrap several actions in the [`batch` API](https://react-redux.js.org/api/batch) provided by `React-Redux`. 


```javascript
import {batch} from 'react-redux';
function NetworkMap({id}){
   useEffect(() => {
     fetchMap(id)
     .then(({nodes}) => {
       batch(() => {
          for(let node of nodes){
            store.dispatch({type: 'ADD_NODE', node: node})
          }
       })
     })
   })
}
```
#### Keep in mind...
An experienced developer may consider that as a hack since is just a wrapper around `unstable_batchedUpdates` API provided by React and documented by a [GitHub PR](https://github.com/facebook/react/commit/b41883fc708cd24d77dcaa767cde814b50b457fe). Anyway, this behaviour can be found in a more stable way in React 18, [here](https://github.com/reactwg/react-18/discussions/41) and [here](https://github.com/reactwg/react-18/discussions/21) (in alpha version at the moment of writing this blogpost). Now it's up to you to decide if you want to introduce this API now in your code or wait for the next React major release.

# Some tools from the future
In this section we are going to mention just two words without going too deep in their usage. Maybe I can decide to dedicate a blog post on this topic. 
If you need to perform a very huge computation and all the techniques above are not enough for you, you can consider to perform the computation in another thread moving out the logic for the main thread that is the one that manages the renders and the user interactions.

To do this you can use:
 - WebWorkers, i.e. run scripts in background threads
 - WebAssembly, i.e. running binary instruction in the browser

Actually, both technologies are not "coming from the future" but they are so rarely used that most of the developers don't know them yet even if most of the modern browsers already support them.

Do you have any other tips? Leave a comment here!

### References
 - https://github.com/kentcdodds/react-performance
 - https://reactjs.org/docs/concurrent-mode-suspense.html
 - https://kentcdodds.com/blog/usememo-and-usecallback
 - https://reactjs.org/docs/react-api.html#reactpurecomponent
 - https://github.com/reactwg/react-18/discussions/21
 - https://github.com/reactwg/react-18/discussions/41
