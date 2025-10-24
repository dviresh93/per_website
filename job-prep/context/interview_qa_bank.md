# Interview Q&A Bank

Common interview questions with prepared answers based on real experience.

---

## LLM Integration & AI Systems

### Q: Have you integrated LLMs with existing systems (databases, APIs, services)? What architectural patterns did you use, and what challenges did you face?

Yes, I've done this in two projects recently.

The first was GridCOP at Grid CoOperator. We needed to let power grid analysts query a SQL database in natural language instead of writing complex queries. The architecture was pretty straightforward - LangChain orchestrating between the LLM (we used Claude), a SQL database with utility data, and a validation layer. The pattern was: user asks a question → LLM generates SQL → we validate the query structure → execute it → LLM formats the results with context for the analyst.

The main challenges were around reliability. LLMs would sometimes generate syntactically correct SQL that made no semantic sense - like joining tables that shouldn't be joined or filtering on the wrong columns. We solved this with a dual validation system: schema validation to catch structural errors, and a domain rules engine that checked if the query actually made sense for power grid data. This brought our query success rate from about 60% to over 90%.

The second project was a drone log analysis tool at Freefly. Drone crash logs (ULog format) are huge binary files with hundreds of parameters. I built a system where engineers could chat with the LLM about what went wrong instead of manually plotting data. The architecture used a Python Flask backend that parsed ULog files, extracted key flight parameters, and ran automated health checks across 11+ systems (IMU, GPS, battery, actuators, etc.). Those health checks produced structured pass/fail results with timestamps, which then fed into Llama 3.2 (running locally via Ollama) for the chat interface.

The main challenge was making the system fast enough for interactive use. ULog parsing and health check analysis took time, so we cached everything after the first pass. That way, when engineers asked follow-up questions, the LLM could respond immediately without re-processing the entire file. We also used WebSockets for streaming responses so it felt conversational rather than waiting for batch processing.

Both projects taught me that the hard part isn't calling the LLM API - it's the orchestration layer around it. You need robust error handling, validation, and smart context management to make these systems reliable enough for production use.

---

### Q: If you've worked with external LLM APIs, how did you handle sensitive data and ensure privacy/security?

Yeah, this came up in both projects I mentioned.

For GridCOP at Grid CoOperator, we were working with utility grid data - not exactly public information. When sending queries to Claude's API, we made sure to never send the actual raw data itself. The pattern was: LLM generates the SQL query, we execute it locally on our database, then only send back sanitized results for formatting. So the LLM saw schema information and aggregate results, but never customer identifiers or sensitive operational data. We also logged every API call with what was sent so we could audit if anything leaked.

The drone log analysis tool required a hybrid approach. Customer flight logs contain sensitive information - GPS coordinates, proprietary flight parameters, customer identifiers. I used local LLMs (Llama 3.2 via Ollama) for anything touching user data. But local models aren't as capable, so to improve accuracy, I'd use external APIs like Claude for understanding open-source documentation, PX4 flight controller specs, or general drone knowledge - basically anything that was already public. The sensitive customer data never left the local environment, but we still got better responses by having the heavier models handle the domain knowledge part.

The approach is: keep sensitive data local, but use external APIs for public context when you need better model performance. Structure your system so there's a clear boundary - local models process private data, external APIs handle public documentation and general knowledge.

---

### Q: Have you used prompt engineering strategies, RAG systems, or fine-tuning in production? Please share an example and what the results were.

Yeah, I built a RAG system for the drone log analysis tool at Freefly. The idea was to embed all our product documentation, code repos, and wiki pages into a vector database so engineers could ask questions like "why did this crash" and get answers grounded in our actual docs instead of the LLM guessing.

First attempt was pretty standard - chunk the docs, embed them, retrieve similar chunks. It didn't work well. The LLM would mix up product names, like suggesting Astro drone fixes for an Altax crash, or reference features that didn't exist in that flight controller version. Lots of hallucinations.

I fixed it by restructuring the vector database into two tiers. The first database stored summaries of chunks plus metadata about where to find the actual details - links to images, code, wiki pages. When a query came in, we'd search the summary database first, find the most relevant chunks, then fetch the detailed content from those specific locations. This cut down hallucinations significantly because the LLM wasn't synthesizing answers from random loosely-related chunks anymore.

I also improved the prompts to make the LLM analyze retrieved context first, figure out what's actually relevant, then formulate an answer. Instead of dumping all retrieved chunks into the prompt, we'd have it reason through what information was needed and cite which docs it was using.

Result was engineers could debug crashes faster without manually digging through documentation. The two-tier approach especially helped in our multi-product environment where keeping context straight mattered.

---

### Q: How did you measure the success of the AI features you built? Which metrics mattered most (technical and/or user/business impact)?

I tracked both technical metrics and actual user impact, but honestly the business impact mattered more.

For GridCOP, the technical metric I cared about was SQL query success rate - whether the LLM generated queries that actually executed and returned correct results. We went from around 60% to over 90% after adding validation layers. But the metric that actually mattered was analyst productivity - how much time they saved not writing SQL manually. We measured research time before and after, and saw about 70% reduction. That's what justified the project - analysts could answer questions in minutes instead of hours.

For the drone log analysis tool, I tracked hallucination rate - how often the RAG system would mix up product names or suggest incorrect fixes. The two-tier vector database approach cut that down significantly. But the real measure of success was time-to-diagnosis for crashed drones. Before the tool, engineers would spend hours manually plotting parameters and cross-referencing documentation. After, they could ask the system directly and get to the root cause much faster. We didn't have exact numbers, but the fact that the team actually used it daily instead of going back to manual analysis told me it was working.

The pattern I've found is that technical metrics (accuracy, latency, error rates) are important for debugging and iteration, but user adoption and time saved are what actually matter. If people aren't using your AI feature, or it's not saving them meaningful time, the technical metrics don't really matter.

---

### Q: Can you briefly describe your hands-on experience with LLMs and embedding, including any work on fine-tuning, prompt engineering, or using vector databases?

I've built two production LLM systems recently - GridCOP at Grid CoOperator and a drone log analysis tool at Freefly.

For GridCOP, I used Claude via LangChain to let power grid analysts query SQL databases in natural language. Heavy prompt engineering to get the LLM to generate valid SQL - structured prompts to analyze queries, identify missing context, then generate and validate SQL before execution. That brought query success rate from 60% to over 90%.

The drone log analysis tool used both local models (Llama 3.2 via Ollama) and a RAG system with vector databases. I embedded all product documentation, code repos, and wiki pages so engineers could ask questions about drone crashes. Started with basic RAG but had major hallucination problems - the LLM would mix up product names. I restructured it into a two-tier vector database: first tier stored chunk summaries with metadata, second tier had the actual content. Query the summary database first, then fetch detailed content from specific locations. This cut hallucinations significantly.

For prompt engineering on the RAG system, I structured prompts to make the LLM analyze retrieved context first, identify what's relevant, then formulate answers with citations. Much better than just dumping retrieved chunks into the prompt.

I haven't done fine-tuning yet - mostly focused on RAG and prompt engineering since they're faster to iterate on and don't require labeled datasets.

---

## Robotics & Systems Integration

### Q: How has robotics played a part in your 3 most recent opportunities?

Robotics has been central to everything I've done in the last 5+ years.

At Freefly Systems (2021-present), I work on drone systems - specifically flight control optimization and diagnostic systems. I've been deep in PX4 flight controller integration, working on payload systems for the Altax and Astro platforms. A lot of hardware-software integration work - tuning flight parameters, debugging sensor fusion issues, analyzing crash logs to figure out what went wrong. Built diagnostic tools that analyze flight telemetry data to catch problems before they become failures. It's been a mix of embedded work on the flight controller side and building support tools to make the manufacturing and field teams more effective.

Before that, at Lumenier (2020-2022), I was developing custom PX4 flight modes for specialized use cases. We built systems for GPS-denied navigation using LiDAR sensors, 360-degree obstacle avoidance, and autonomous surveillance capabilities. The interesting technical challenge there was getting multiple sensors (LiDAR, optical flow, IMU) to work together reliably using MAVLink and UAVCAN protocols. Worked directly with the PX4 maintainer community on core flight stack improvements. That role was heavily focused on making drones operate autonomously in environments where GPS wasn't available.

At York Exponential (2018-2020), I worked on two robotics projects. One was an autonomous surveillance robot - mobile platform with computer vision for security applications. The other was a collaborative welding robot using Universal Robots hardware with ROS2. Built an HMI system to simplify robot programming for welders who weren't software engineers. That was my introduction to working with industrial robot arms and ROS2 for multi-robot coordination.

All three roles involved real-time systems, sensor integration, and getting hardware and software to work together reliably in production environments.

---

### Q: Can you describe your experience with CAD tools such as SOLIDWORKS or Siemens NX? Have you used these platforms for mechanical design, prototyping, or creating custom robotic components?

I don't have hands-on experience with SOLIDWORKS or Siemens NX for mechanical design work. My background has been primarily on the software and embedded systems side of robotics - flight control software, sensor integration, and firmware development.

That said, I've worked closely with mechanical engineers who used these tools. At Lumenier, when we were integrating LiDAR sensors and building custom mounting solutions for obstacle avoidance systems, I collaborated with the mechanical team on sensor placement and FOV requirements. I could review their CAD models to verify sensor positions and clearances, but I wasn't the one designing the parts. Same thing at York Exponential when we built the autonomous surveillance robot - I worked with the mechanical team on the mobile platform design to ensure our sensor suite and compute hardware would fit properly.

I'm comfortable reading CAD models and working with mechanical engineers to translate software requirements into physical constraints, but I haven't done the actual CAD work myself. If the role requires CAD proficiency, I'd need to come up to speed on those tools, though I understand the fundamentals of mechanical design from working alongside mechanical engineers for the past 5+ years.

---

### Q: What experience do you have with manufacturing processes and materials selection for robotics or mechatronics systems? Have you worked directly with fabrication teams or specified materials for custom builds?

I've worked with manufacturing teams but more from the systems integration and quality assurance side rather than direct materials selection or fabrication design.

At Freefly, I've been heavily involved with the production side - building diagnostic systems and quality assurance protocols for drone manufacturing. When we had issues in production, I'd work with the manufacturing team to debug whether it was a hardware problem, firmware issue, or assembly error. I built automated log analysis tools that helped catch problems during production testing, which improved our manufacturing workflows. But I wasn't specifying materials or designing the fabrication process - I was making sure the systems worked correctly once assembled.

At Lumenier, when we were developing custom flight modes and integrating LiDAR sensors, I worked with external partners and suppliers on sensor mounting and integration. We'd specify requirements like vibration tolerance, weight constraints, and environmental conditions the hardware needed to handle, but the actual fabrication and material choices were handled by the mechanical team or suppliers. My focus was ensuring the sensors worked reliably with our flight control software once installed.

At York Exponential, building the autonomous surveillance robot involved working with the team on component selection - choosing compute hardware, sensors, motors - but again, the actual fabrication of custom parts and material selection was done by others. I focused on the software and integration side.

So while I understand manufacturing constraints and have worked closely with fabrication teams, I don't have direct experience specifying materials or designing for manufacturing. I'm more experienced in the "does it work reliably in production" phase rather than the "how do we build it" phase.

---

### Q: Have you performed Finite Element Analysis (FEA) for structural or modal simulations in your previous roles? Which tools did you use, and what types of robotic or automation projects did you apply FEA to?

No, I haven't done FEA work. That's been outside my area - my background is software, embedded systems, and flight control rather than structural analysis or mechanical simulation.

In my roles, when structural or vibration analysis was needed - like at Lumenier when we were mounting LiDAR sensors on drones or dealing with vibration isolation - the mechanical engineers handled the FEA work. I'd provide requirements from the software side (sensor specifications, mounting constraints, vibration tolerances needed for reliable sensor data) and work with their results, but I wasn't running the simulations myself.

This is a gap in my skill set. If FEA is critical for the role, I'd need training on those tools and methodologies.

---

### Q: Can you detail your experience with PyTorch or JAX, especially in the context of robotics, machine learning, or automation systems? Have you used these frameworks for developing or deploying control algorithms or models?

I don't have experience with PyTorch or JAX for robotics applications. My control systems work has been with traditional embedded approaches - PID controllers, sensor fusion, state estimation - all implemented in C++ for real-time flight control systems.

I've used ML frameworks recently, but for LLM-based applications (agent systems, RAG pipelines) rather than robotics control. That's a completely different domain from using PyTorch or JAX to train control policies, motion planning models, or perception systems for robots.

If the role involves using ML for robot control - things like training policies for manipulation, learning-based motion planning, or vision-based control - I don't have that experience. My robotics background is traditional control theory and embedded systems, not learned control.

---

### Q: Please describe your hands-on experience integrating hardware and software for real-time robotic systems. What platforms, protocols, and approaches have you used to ensure robust and reliable integration?

Most of my hardware-software integration experience has been with drone flight control systems over the past 5+ years.

At Lumenier and Freefly, I worked extensively with PX4 - an open-source autopilot software that runs on embedded flight controllers. It's the real-time system that handles sensor fusion, flight control, and communication for autonomous drones. My work involved integrating sensors (LiDAR, optical flow, IMU, GPS) into the flight controller and making sure they worked reliably in real-time. This meant working with communication protocols like MAVLink (a lightweight messaging protocol for drones) and UAVCAN (a CAN bus protocol for connecting sensors and actuators). The challenge was ensuring data from multiple sensors got processed within tight timing constraints - miss a cycle and the drone becomes unstable.

For sensor integration, I'd write C++ firmware to read sensor data over I2C, SPI, or UART, validate it, feed it into the estimator, and make sure the control loops stayed stable. A lot of debugging involved analyzing flight logs to figure out where timing issues or sensor failures occurred.

At Freefly specifically, I focused on payload integration - getting cameras, gimbals, and other equipment to work seamlessly with the flight controller on their Altax and Astro platforms. Built diagnostic tools and automated testing systems to catch integration problems during manufacturing before drones shipped to customers. This reduced field failures significantly because we could identify sensor issues, communication problems, or timing bugs early in the production process.

At York Exponential, I worked with ROS2 for industrial robot integration - specifically a collaborative welding robot using Universal Robots hardware. ROS2 handled the communication between different subsystems (robot arm, sensors, HMI), and I built the software that coordinated multi-robot operations. Different from drone work because timing constraints were less strict, but reliability was still critical in a manufacturing environment.

Common thread across all these projects: hardware-software integration in robotics is about managing real-time constraints, handling sensor failures gracefully, and building robust communication between components. You need good logging and diagnostic tools because when things fail, you need to understand what happened quickly.
