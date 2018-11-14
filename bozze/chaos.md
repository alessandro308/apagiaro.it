---
layout: post
title: "A Chaos Engineering, what is it?"
date: 2018-11-14
excerpt: "Chaos Engineering is the discipline of experimenting on a distributed system in order to build confidence in the system’s capability to withstand turbulent conditions in production."
tag:
 - chaos
 - testing
comments: true
feature: /assets/img/post-image/chaosMonkey.png
showFeature: false
---

> TLTD; Chaos Engineering is shutting down randomly nodes in the production environment. If the health of the system is good enough, the test is passed.

Today the distributed complex systems are very used. Often we listen to *works on the cloud* and, often, the system is a distributed system that relies on a bigger distributed system. All this complexity have to be managed and test and some classical approaches can be useless since they cannot simulate all the variables of the real system.

Netflix uses a distributed system to serve its contents and has found a peculiar way to test its environment. It does software verification in a production environment. In the past, "test it in production" is a form of gallows humour, a synonymous of "we don't verify the code properly before deploying it". Then, today, "test it in production" is a discipline and this discipline is called "Chaos Engineering".

> Chaos Engineering is the discipline of experimenting on a distributed system in order to build confidence in the system’s capability to withstand turbulent conditions in production.

![Chaos Monkey Logo]({{ site.url }}/assets/img/post-image/chaosMonkey.png)

Chaos Engineering is a form of experimentation that generates new knowledge about a system. This knowledge is difficult to be evaluated in a tradition way since testing is done in a simulated environment. Think about your system, how to test how the system responses to a failure of an entire region or data center? How to test the maxing out CPU cores on an Elasticsearch cluster?

Of course, before to start some Choas Test you have to prepare your system to be resilient to real-world events. If you already know that your system is not ready, applying the chaos principles to your system is like a suicide.

# Example of Systemic Complexity

## System description
There is an example in the [Chaos Engineering](https://www.oreilly.com/library/view/chaos-engineering/9781491988459/) book that best explains what is the systemic complexity and why it is so difficult to find errors in that systems.

Image a distributed system. This system is composed of several microservices: A, B, C, D. Then suppose that D is the microservice that exposes some APIs that serve customized contents. The customized contents are computed by the microservice A that has an elastic infrastructure, i.e. if more resources are required a new instance is created, if some instance uses few resources (CPU and Memory) it is turned off. 
Then, in A exists a module that distributes the traffic according to a hash function among the up and running nodes.

A classic workflow for a request is:
 - The request arrives in E by an API invocation
 - E contact A
 - A compute the internal node that has to manage the request (using the hash function)
 - The internal node computes the result and sends it to E
 - E reply to the client

Of course, the system is designed to prevent some errors so:
 - If E doesn't receive a response from A, E serve some standard contents
 - If an internal node of A is not able to compute some customized result, it serves results from its cache


## The customer
The customer has a mobile application that request content. Unfortunately, his device is offline so, even if it pushes the button to get the content, no content is returned. But the customer persists (or the device tries until succeed), so he pushes the button one hundred times and all the requests are queued. Then his device connects to the network and executes all the requests at the same time.

Now the system (E) receives all the requests and sends them to A. A identifies the internal node (A1) as the node that has to compute the result. Of course, 100 requests at the same time can be a huge computation to do so it is suddenly unable to hand off all the requests and starts serve them from the cache. Serving contents from the cache causes reduction of CPU and Memory usage that triggers the cluster-scaling policy and A1 is terminated. Now, all the requests are distributed according to the new hash function among the other nodes. Another node, A2, has now responsible for the remaining requests done by our customer. 

Of course, even if we have a no-downtown policy the reality is much different. The system is migrating resources and is not able to reply to E that timed out its request to A. In order to avoid to show the error to the customer, it invokes the fallback and returns a less personalized content. Now the customer finally gets a response, but he notices that the content is less personalized and tries to reload the page, more and more times for good measure. A2 is working harder now, so it starts to respond from its cache... and so on...

## Why did it occur?
It is difficult to identify this type of problem. If someone had run some unit tests, all the module works in a perfect way:
 - The fallback was rational and works
 - Each microservices has balanced his monitoring, alerting and performances
 - The scale rules that watch CPU load and Memory utilization have done their jobs

The scenario above is called [bullship effect](https://en.wikipedia.org/wiki/Bullwhip_effect): a small perturbation in input can cause dramatic fluctuations in output.

# How does Chaos Engineering work?
Netflix, when creates the Chaos Engineering experiments, kept in mind the following principles (from [Principle of Chaos](https://principlesofchaos.org/)):
 - Start by defining *steady state* as some measurable output of a system that indicates normal behaviour. In the case of Netflix, they measure how many videos are started per second. Some other examplez can be *product sold per minute* or *views per seconds*.
 - Hypothesize that this steady state will continue in both the control group and the experimental group
 - Introduce variables that reflect real-world events like servers that crash, hard drives that malfunction, network connections that are severed, etc.: the most interesting cases are when several events are combined e.g. try to simulate hardware failures, network latency and functional bugs at the same time. Netflix turns off machines and simulates regional failures even if to do so is costly and complex, only because it can happen and they have to be prepared to it. Don't limit your imagination! 
 - Run experiment in Production: which is the best method to test a software in an environment as close to the production environment as possible? Use the production environment! This approach is able to test the entire overall system.

# Some consideration
If you are reluctant to run chaos experiment in your system, you have to start thinking why. 
 - If the answer is that your system is not ready to manage these events, then there is a problem. These events can appear every time, you have to improve the robustness of your system.
 - If your fear is that the experiment destroys your system in order to find a weakness, this can be resolved in several ways:
  - All the experiments have to be easy to abort
  - You have to minimize the blast radius of the experiment

You have to create a system that terminates all the experiment immediately and recover the system. No excuse to don't run the experiment, just use the real strategy!

# The tools
## Chaos Monkey [GitHub]
Chaos Monkey randomly terminates virtual machine instances and containers that run inside your production environment. Exposing engineers to failures more frequently incentivizes them to build resilient services.

## ChaosKong [Blog Post](https://medium.com/netflix-techblog/chaos-engineering-upgraded-878d341f15fa)
![Chaos Kong Logo]({{ site.url }}/assets/img/post-image/kong.png)
After Choas Monkey, another tool was created. "We built Chaos Kong, which doesn’t just kill a server. It kills an entire AWS Region." (ok, ok, it simulates to kill an entire region...)

Oh, the last thing, Netflix [is opened to any ideas about chaos](https://medium.com/netflix-techblog/chaos-engineering-upgraded-878d341f15fa), chat them at chaos@netflix.com.


