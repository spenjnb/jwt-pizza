# Curiosity Report: [Your Topic]

## What is the origin of the Agile movement?
[The agile movement was created in response to a need for faster development cycles.It is a more flexible approach compared to the linear waterfall method. The agile method works better for teams working on projects.
The four main principles of the agile manifesto are Individuals and interactions over processes and tools, Working software over comprehensive documentation, Customer collaboration over contract negotiation, Responding to change over following a plan
The agile method was necessary in a world where technology is constantly evolving and software developers have to adapt.]

## How does it work?
[The Agile method works by breaking down complex problems into smaller, manageable components, allowing teams to develop and test iteratively while gathering user feedback to adapt quickly. 
This flexibility avoids the rigidity of traditional approaches like the waterfall method, enabling teams to refine their processes and deliver better-quality software faster. 
Agile prioritizes continuous improvement, fostering collaboration and personal responsibility among team members, which leads to higher productivity and satisfaction. 
By aligning development with real user needs and allowing for ongoing enhancements, Agile helps organizations deliver superior digital experiences and retain top talent.]

## Why is it useful?
[People use the Agile method because it provides flexibility, adaptability, and better results compared to traditional methods like Waterfall. 
Agile emphasizes continuous feedback, collaboration, and iterative development, allowing teams to adapt to changing requirements and address issues early in the process.
This leads to higher-quality software that better meets customer needs while optimizing team efficiency and productivity. Agile's focus on transparency, frequent delivery, and ongoing support ensures projects are well-managed and continuously improved.]

## Examples

Agile development focuses on building small, functional pieces of software incrementally.

### Example: Adding a new feature in a sprint

#### Initial Sprint: Basic functionality
```javascript
// Initial version: Basic login functionality
function login(username, password) {
  if (username === "admin" && password === "password123") {
    return "Login successful!";
  }
  return "Invalid credentials!";
}// Enhanced login with validation
function login(username, password) {
  if (!username || !password) {
    return "Username and password are required!";
  }
  if (username === "admin" && password === "password123") {
    return "Login successful!";
  }
  return "Invalid credentials!";
}
// Connecting login functionality to a database
async function login(username, password) {
  const user = await db.getUser(username);
  if (!user) return "User not found!";
  if (user.password === password) return "Login successful!";
  return "Invalid credentials!";
}
```
## Resources
[https://agilemanifesto.org/
https://www.agilealliance.org/agile101/the-agile-manifesto/
https://www.infoworld.com/article/2334751/a-brief-history-of-the-agile-methodology.html
https://www.unosquare.com/blog/agile-development-101/#:~:text=If%20you're%20familiar%20with,use%20agile%20in%20their%20work.
