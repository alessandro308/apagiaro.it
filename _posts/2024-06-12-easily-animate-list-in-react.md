---
layout: post
title:  "How to improve your lists with a few lines of code"
date:   2024-06-12
excerpt: "Here are my two cents on how we improved a simple UI in a matter of minutes using just two libraries."
tag:
- react
- UX
- libraries
feature: http://apagiaro.it/assets/img/post-image/list.png
comments: true
---
One of the most common patterns used to offer to our users some data is to present the data as a list. A list is easy to understand, easy to filter, easy to sort and also easy to improve if you know how.
Here are my two cents on how we improved a simple UI in a matter of minutes using just two libraries.

When a user sees a list, if something changes, it should immediately be clear to our user what just happened. This can be done using a blinking row or word, a pattern frequently used in the financial fields but in a web app that doesn't want to appear deployed in the 90's I think we can do better.

Most of the time, changes in the list can happen because:
- A new row has been added
- A row has been removed
- Line order has been changed
- Some rows have been removed because of a filter

Luckily, these changes can be highlighted with just a few animations. Yeah yeah, no, animation! It is hard to write and struggle with CSS rules, especially if your team is not used to working with them and hasn't built a framework to support the daily activities. But here is a solution: [AutoAnimate](https://auto-animate.formkit.com/) a library that can enhance your UX in a single line. Everything that is required to do is import the library, it can be a framework agnostic library or a simple hook for your React component, and be sure that your application preserves the DOM objects between different states, for instance providing the [key to our React items](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) as you should already do.

``` jsx
import { useAutoAnimate } from '@formkit/auto-animate/react'

function MyList ({data}) { 
	const [animationParent] = useAutoAnimate() 
	return ( 
		<ul ref=   {animationParent}> 
		{
		   data.map(({value, key}) => <li key={key}>{value}</li>)
		} 
		</ul> 
	) 
}
```

And we can stop here the post because this will improve _per se_ your app. 
But there is more!

As said, most of the time we want also to offer the filter and sort capability to our users, and those functionalities are often provided using a backend API. The second suggestion I can give to you is to start using [React Query](https://tanstack.com/query/latest/docs/framework/react/quick-start) because there is a hidden gem feature that usually is not advertised as a ReactQuery functionality, the `placeholderData`  option. It can be confused with the `initialData` option but it covers totally different use cases that we can take advantage of in our scenario. 

If set, the `placeholderData` will be used as the placeholder data while the data are fetched. If you provide a function for placeholderData, as a first argument you will receive previously watched query data if available.

This lets us offer our users a better transition state, showing the old data while retrieving the new one, avoiding to completely change the UI with a global spinner or another transitional element. For instance, when our user filter our data, so ask to switch between different queries (ie. different API requests) using that functionality permit us to show previous data and apply new data on the same list, highlighting the changes using the just automagically added animations.

A complete example is reported below to show how it can be used. And trust me, those few lines will result in a great improvement in your application.

```jsx
import {
   useQuery, keepPreviousData
} from "@tanstack/react-query";

import { useAutoAnimate } from '@formkit/auto-animate/react'

function MyList () { 
	const [animationParent] = useAutoAnimate() 
	const [search, setSearch] = useState();
	
	const {
	   data,
	   isPlaceholderData,
	   isFetching,
	} = useQuery({
	  queryKey: ['myentities', {search}],
	  queryFn,
	  placeholderData: keepPreviousData
	});

	function handler(e) {
	  setSearch(e.target.value);
	}
	return (
	  <div>
	    <TextField loading={isFetching} onChange={handler} />
		<ul ref={animationParent}> 
		 { data.map(({value, key}) => <li key={key}>{value}</li>)}
		</ul> 
	  </div>
	) 
}
```

Do you know some other easy win improvements that can be applied to your apps? Feel free to share your favourite library to built a better apps!

ps. If you are already using ReactQuery, and you're not using the latest version of that library, you may find the `placeholderData` property slightly different. [Check here](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function) how it was called in the previous versions. 