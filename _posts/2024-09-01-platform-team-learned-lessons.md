---
layout: post
title:  "Essential Lessons for Leading a Platform Team: Insights from the Front Lines"
date:   2024-09-01
excerpt: "Leading a platform team has revealed essential lessons in API testing, documentation, and developer convenience for smoother integration and adoption. Here what I've learned in the first months."
comments: true
---
As products grow, managing them becomes increasingly complex, necessitating company-wide strategic decisions and the establishment of a dedicated platform team. 
As our company expanded, maintaining a large, shared codebase introduced challenges such as team coupling, difficult release coordination, and complex testing. 
To address these issues in my team, we decided to adopt a micro-frontends (MFE) architecture, which simplified testing and development by allowing isolated page updates.

The successful transition to the micro-frontends (MFE) architecture highlighted the necessity of a platform team to scale the framework across the organization. Now, as I lead this new team, our primary focus is on integrating the framework company-wide while minimizing disruptions to other teams. This represents a significant shift from our previous, less structured approach.

Leading the Platform Team during these initial months has provided me with valuable insights from my experiences and mistakes. Below are some lessons I’ve learned that I hope will assist other team leaders in similar situations. This structured list also serves as a reference for me to revisit in a few months to evaluate my progress and ensure I avoid repeating past mistakes.

#### 1. Test new API internally

Create a dedicated sub-team within the platform team that actively works on new features and tests real-world use cases of the APIs you design. It's crucial to allocate sufficient time to implement the new API on an actual backlog story. This practice ensures that everything functions as expected and helps identify any edge cases that may have been overlooked during the design phase. Testing in a real scenario is key to validating your work and refining the API for broader use.

#### 2. Balancing API evolution
Accept that while you're developing new APIs, other teams will continue building with the existing ones. Their work may need to be refactored once your new APIs are ready. If you push them to adopt the new APIs prematurely, it can put your team under pressure, forcing you to fix bugs on the fly and losing the opportunity to thoughtfully refine the API design.

The risk here is twofold: if the APIs don't work as expected, your team may become a bottleneck for other teams. Additionally, if you discover a better design after initial implementation, you're constrained by how other teams have already used the unstable API. Unlike your team, which has the luxury of testing and refining, other teams might not have the time to thoroughly evaluate the API's usability in real-world scenarios. It's important to allow other teams to continue their work uninterrupted while you perfect the new APIs, even if it means refactoring later.

#### 3. Write a complete documentation
Writing documentation might not be the most enjoyable task, but it's essential for a platform team. Ensure that your APIs are thoroughly documented, including practical examples and use cases. Up-to-date documentation can save a significant amount of time that would otherwise be spent in meetings explaining new features to other teams. It also helps new team members quickly understand how the code is structured, without having to rely solely on reverse-engineering the existing code. Well-maintained documentation is a powerful tool that enhances efficiency and knowledge sharing across the organization.

#### 4. Empowering Advocates for Innovation 
Identify key individuals in other teams who can help advocate for new features and patterns. Schedule regular updates and Q&A sessions with these team members to keep them informed and aligned with your development strategy. By fostering direct communication and building support within other teams, you can ensure smoother adoption of new features and patterns, and address any concerns or questions they might have early on. This collaborative approach helps build a stronger, more cohesive development environment across the organization.

#### 5. Avoid Overengineering Potential Issues
Don’t get caught up in overthinking potential problems that new development might cause. For example, we once spent considerable time addressing a potential performance issue with our MFE architecture coexisting with a monolithic application. This task took three times longer than anticipated, and we're still uncertain if it was necessary.

Instead, base your decisions on the feedback from the sub-team actively building and testing new features. They can provide practical insights into whether certain concerns are worth addressing immediately or if they can be handled as part of the regular development process. Prioritize tasks that have clear, demonstrated value rather than preemptively solving issues that may not materialize.
#### 6. **Account for Developer Convenience**
Recognize that developers often prefer convenience. When introducing new features, consider if there is existing code that already implements similar functionality. If possible, maintain the old interface to ease the transition and avoid forcing developers to adopt a completely new approach immediately.

For example, we added a React-Query-like cache to our old HTTP Client. This allowed developers to benefit from caching without having to change their existing request patterns. Although the old HTTP Client didn’t offer the auto-re-rendering capabilities of React-Query, it provided a smoother transition. Developers could keep their existing state management while deciding when to fully migrate to React-Query based on their priorities and backlog. This approach helps in balancing new functionality with developer convenience, facilitating smoother adoption.