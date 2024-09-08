---
layout: post
title:  "Remote Development: A Hybrid Approach to Testing and Collaboration"
date:   2024-09-08
excerpt: "A practical strategy to start to experiment a remote development environment in your company"
comments: true
---
Remote development offers a powerful enhancement to the traditional local development environment that developers typically use for writing and testing code. During my internship at Yelp, I used this approach extensively, and what I’ll share here is a summary of that experience combined with insights from tests I’ve conducted in my current company.

Remote development environments have become increasingly popular as developers look for ways to streamline their workflows and take advantage of powerful cloud-based infrastructure. While these environments bring many advantages, they also come with trade-offs that you need to know before to find a mitigation strategy and boost your team productivity.
### Benefits of Remote Development Environments

1. **Access to More Resources**: One of the biggest advantages of using a remote development environment is access to a more powerful machine. This allows developers to work with larger datasets and test their code under more realistic scenarios, which may be impossible to replicate on a local machine with limited resources. The enhanced computing power of remote environments helps in running resource-intensive tasks without the fear of overloading your local machine.
    
2. **Collaboration and Integration**: Remote development fosters collaboration by allowing developers to share environments. This accelerates the integration process, as team members can work together in the same space from the early stages of development. Moreover, sharing the environment means that any issues or bugs can be identified and resolved more quickly, especially when a dedicated team maintains up-to-date templates and configurations.
    
3. **Reduced Strain on Local Machines**: Since the heavy lifting is done by the remote environment, local machines are freed from CPU or memory pressure. This is especially useful when working on large projects that require significant computational resources. Developers can perform tasks on their regular devices without worrying about the performance bottlenecks they would typically face with a local setup.
    
4. **Improved Support**: When something goes wrong, it’s easier to get support from specialized colleagues or teams. Working within an environment created from a well-tested, up-to-date template minimizes the potential for configuration drift, making it easier for others to jump in and provide assistance.
    
### Cons of Remote Development Environments

1. **Dependency on Internet Connectivity**: Perhaps the most significant drawback of a remote development environment is that it cannot be used offline. Developers are entirely reliant on a stable and high-speed internet connection. Any disruption in connectivity can interrupt workflow, leading to delays.

2. **Synchronization Challenges**: Keeping the remote environment synchronized with the local codebase can be tricky. Developers have to choose between various methods such as pushing and pulling code, using remote IDEs, or using scripts like rsync to sync local and remote files. While modern IDEs have made this process more manageable, it can still be time-consuming and prone to errors.

3. **Cost Considerations**: While powerful remote environments are efficient, they can also be expensive if not managed properly. To keep costs down, developers must be strategic, sharing resources when possible and leveraging on-demand environments created from templates. Careful planning and optimization are needed to ensure cost-effectiveness, especially when working with a team.

### A Hybrid Approach for Testing in Remote Development Environments

A strategy I’ve found effective is to use the remote machine only for testing the parts of the system that have been modified, while relying on a shared global testing environment for everything else. This hybrid approach simplifies the process and is particularly useful for managing complex systems. 

In traditional local development environments, developers often face the challenge of replicating large sections of the system just to run comprehensive tests. While mocking services and running unit tests can help, they are insufficient when a full system test is required. Many companies, including my current workplace, **Domotz**, rely on a shared testing environment where developers follow a _gentleman’s agreement_: that code deployed to the testing environment should be fully functional or, at the very least, thoroughly tested locally to catch any major issues.

However, this system creates a significant burden on developers. They spend valuable time mocking components and generating fake data, a process that may work in smaller teams but doesn't scale well for larger development teams. A more scalable solution is required to optimize both testing efficiency and collaboration.

### A Scalable Solution Inspired by Yelp

At **Yelp**, the team addressed this challenge with a more refined method. While there was still a global testing environment, developers had the flexibility to configure the routing system to run specific microservices in their remote environment. This allowed each developer to test their code in a realistic production-like scenario without having to rely on mocks or fake data, while simultaneously protecting the shared environment from disruptions.

The key advantage of this approach was the ability to test code under real conditions without overwhelming or interfering with the shared system. This solution was particularly useful in larger teams, where different developers were often working on overlapping sections of the codebase. By isolating tests to their specific microservices, developers could work more independently and avoid conflicts.

However, this setup had its own challenges. Since it used a shared database, developers had to be mindful of how their tests could affect the global test data. There was always the risk of polluting the dataset or affecting other developers’ tests if isolation wasn’t properly maintained. Despite these limitations, this system allowed for faster and more effective development and testing processes in large-scale organizations like Yelp.

### Replicating the Yelp Approach

Attempting to replicate this setup at **Domotz** required some creative thinking. While I’m not entirely sure of the exact implementation Yelp used, I recalled a similar system involving a Chrome extension and routing configurations. This led me to explore a combination of tools to achieve a similar result.

The solution involved injecting custom headers through a Chrome extension, along with adjustments to the **Envoy** configuration using [HTTP Dynamic Forward Proxy](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/http_proxy). In addition, changes were made to the backend core libraries to ensure the custom headers were propagated correctly. This configuration allowed **Envoy** to recognize the headers and forward requests to my specific development cluster, making it possible to test only the parts of the system that were modified.

By isolating these requests, I could test changes without impacting the shared environment or relying heavily on mocks and fake data. This setup significantly improved my ability to test in a live environment while minimizing disruptions to my colleagues. Although I still need to generate mock data for end-to-end or integration tests, I can now focus on testing specific use cases rather than being forced to mock data just to move forward. Moreover, this approach allows me to explore how the system functions in real-time. I can make changes, observe how the data flows through the system, and better understand its behavior when I'm unsure of the internal data processes.

### Final Thoughts

Using a remote development environment doesn’t just offer raw power and collaborative opportunities—it also unlocks innovative ways to approach testing and development workflows. As shown by Yelp's implementation and my experience at Domotz, hybrid approaches like using selective microservice routing can bring scalability and efficiency to teams of any size. Although it requires careful implementation to avoid polluting shared resources, the benefits of streamlined testing and isolation make this strategy a compelling choice for developers working on complex systems.