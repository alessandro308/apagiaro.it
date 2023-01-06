---
layout: post
title: "React Context API in Python"
date: 2023-05-01
excerpt: "An API to pass data in the inner function inspired by React Context"
project: false
tag:
- python
- react
comments: true
---

As a Python developer you may not know what React Context is. Let me explain this fantastic tool and why sometimes can be useful to have that pattern in our backend code.

React Context is a way to pass data through the component tree without having to pass props down manually at every level. It can be useful in a number of cases, such as when you have deeply nested components and you don't want to pass props down through all of them. Using React Context can help to make your code more reusable and maintainable, as well as making it easier to understand how your data is being used and where it is coming from. It can also help to reduce the amount of prop drilling that you have to do in your application.

```
function Button() {
  const { theme} = useContext(ThemeContext);

  return (
    <button style={theme}>
      A simple button
    </button>
  );
}

function ThemeProvider extends React.Component {
    const themeValue = {color: 'blue'}
    return (
      <ThemeContext.Provider value={themeValue}>
        <Button/>
      </ThemeContext.Provider>
    );
}
```

The code example demonstrates the power of the pattern. In practice, it allows inner components to access the themeValue when needed, rather than having to pass it down manually. This is made possible because the components are wrapped in the ThemeContext.Provider element.

## A practical use case
After reading about this idea on some Python forums, I decided to implement a similar library in Python.

The practical need that this approach try to resolve in our codebase is to perform a better loggin without pollute all the function with an extra logger argument.
In fact our codebase consists of multiple layers, and not all of the logic is in the main handler function (i.e. the top layer). Instead, requests are handled by multiple layers, each with a specific scope, and every function invoked during the request handling should use a custom logger to permit to decode the log lines with the request id.

Before implementing this library, we had to pass the logger object down through all layers, which resulted in cluttered functions with many arguments due to the inclusion of the logger argument at every invokation.

To resolve this problem I'm proposing an API that you can use to wrap a piece of flow (code) with some variables and then use a specific API to get the set variables when you need, even in a deep function.

In code, this is the result:

```
def nested_function():
    return get_context('something', 'default_value')

def in_between_function():
    return nested_function()

with use_context(something=123):
    value = in_between_function()
    print(value) # 123

print(nested_function()) # 'default_value'
```

## Library details

In practice, to set variables you can use the `use_context(**variables)` API that accept one or more named arguments and set them in the current context. 

It can also be used to define nested context, so you write code like

```
def nested_function():
    return get_context('something', 'default_value')

def in_between_function():
    with use_context(something='nested_value'):
        value = nested_function()
        print('Nested Value', value) # Nested Value 'nested_value'
    original_value = nested_function()
    print('Outer value', original_value) # Nested Value 'original_value'

with use_context(something='original_value'):
    in_between_function()
```
to handle more complex scenarios.

Then, to retrieve the value, you can simply use `get_context(key, default)` API that has the string used as a key as a first parameter and the default value to use if no context is found as a second optional parameter.

One problem that may be raised by this pattern is the complexity to understand where the current context value has been set. To help in this task
the library provides the `debug_context` API. 
This function can replace the `get_context` and adds, in addition to the retrieve function, a print in the log to know where the variable has been set.
Basically it prompt an output like:

```
.../some_file.py (line 80) - function_name_3
 .../some_other_file.py (line 83) - function_name_2
  .../some_other_file.py (line 86) - function_name_1
   .../deep_most_file.py (line 89) - function_name_0 <- Found context variable_name defined here
```

## Install and code
You can find the source code on [Github](https://github.com/alessandro308/react_context)
or you can start to use it with 
```
pip install react-context
```

## How it works

In Python, when a function is called, a new stack frame is created to hold the function's local variables and the memory address of the next line of code to be executed once the function returns. This stack frame is pushed onto the call stack, which is a data structure that tracks the function calls made in a program.

In practice, the library uses the frame memory address as a function instance identifier and since the caller function remains in the stack until the context is defined, when `get_context` is invoked, the library performs a lookup in an object using the frame ids from the current stack to search for the value. It loops all the frames in the stack until it find a value.

The library may not work on Python interpreters different than CPython.

_This article has been written with the help of ChatGPT. The code has been entirely written by humans_