---
layout: post
title: "How to dispatch an action from a reducer in Redux."
date: 2019-06-09
excerpt: "You shouldn't do that. Use a store enhancer to manage that."
comments: true
feature: /assets/img/post-image/redux-loop.png
showFeature: true
---

> TLDR; You shouldn't do that. Use a store enhancer to manage that.

Let's start from the beginning:
<p class="notice">Reducers are just pure functions that take the previous state and an action, and return the next state.</p>

A reducer is a pure function, that means that it doesn't produce any side-effects.

**A network call is a side-effect, as well as dispatch another action. For this reason, you simply shouldn't dispatch an action in a reducer.** And, since you shouldn't, you don't have access to the dispatch function inside a reducer, that it is probably the reason why you googled the title of this post. Moreover, since often they are asynchronous, it becomes very complex to manage the state updates without forcing some anti-patterns.

# The solution: [redux-loop](https://redux-loop.js.org/)

<img src="{{site.url}}/assets/img/post-image/redux-loop.png" style="float:right; margin: 10px; width: 200px"/> Redux-loop is a library that permits to describe some side-effects in reducers. Notice, it only describes the side effects, doesn't execute them in the reducers. But, let's start from the beginning.

Redux permits, when a new store is created, to pass an *enhancer* as the third parameter of [`createStore`](https://redux.js.org/api/createstore). This enhancer is a function (simple function or a combination of more function, see [`compose`](https://redux.js.org/api/compose) that permits to add some functionalities to the store. And this is exactly what we want: add new functionality to the store that permits to execute some functions (our side effects function, i.e. dispatch an action) outside the reducers so to maintain a pure function. In practice, our reducers instead of returning just a state will return a state and a command (basically a function) that will be executed. A pair of (state, command) is what the [`loop` function](https://redux-loop.js.org/docs/api-docs/loop.html) generates.

## How to use it
#### Add a new store enhancer
In order to use Redux-loop, a new store enhancer have to be added. This can be done easily just invoking the `install` function as store enhancer:
```javascript
import { createStore, compose, applyMiddleware } from 'redux';
import { install } from 'redux-loop';

import someMiddleware from 'some-middleware';

import reducer from './reducer';
const initialState = {};

const enhancer = compose(
  install(), // <-- Where the magic appears!
  applyMiddleware(someMiddleware), // If you have some other enhancer, i.e. Redux DevTools Extention for Google Chrome
)

const store = createStore(reducer, initialState, enhancer);
```

#### Create a Cmd in the reducer
Since we have this store enhancer active, now in the reducer we can simply return a `loop` object as shown in the example below.

```javascript
import { loop, Cmd } from 'redux-loop';
import * as Actions from './actions';

function reducer(state, action) {
  switch(action.type) {
    case 'INVOKE_ANOTHER_ACTION':
      return loop(
        { ...state, first: true },
        Cmd.action({ type: 'OTHER_ACTION TO INVOKE' })
      );

    case 'FETCH_NETWORK_DATA':
      return loop(
          { ...state, loadingData: true},
          Cmd.run(fetchData, {
              [userId], // Parameter to pass to function 
              successActionCreator: Actions.dataReceived, // Action to invoke on success
              failActionCreator: Actions.dataError, // Action to invoke on failure
          })
      )

    case 'SIMPLE_ACTION':
      // Just return a new state as usual
      return { ...state, second: true };
  }
}
```
<p class="notice">
Remember to return a `loop`, since invoking `Cmd.run` does not execute any function!
</p>

### Under the hood

With this library, when a `loop` is returned, a pair is returned:
 - a new state is returned as you did before using this library
 - a description of a command, built with the `Cmd.___` factories

Then there is a store enhancer, described in the [`install` function](https://github.com/redux-loop/redux-loop/blob/master/src/install.js) that applies the state returned as expected and only after that assignment runs the `Cmd` passed. 
