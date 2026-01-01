<video width="640" height="360" controls>
  <source src="images/intro.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

# Bolt

**Bolt** provides **real-time collision detection and avoidance** in industrial automation applications. It allows PLCs to communicate with a physics engine to obtain detailed information about moving objects and their environment, enabling dynamic trajectory management and motion coordination. It supports

- Scene descriptions via [URDF](https://wiki.ros.org/urdf/XML/model)
- Real-time collision queries
- Closest distance calculation
- Predictive queries by passing current velocity and acceleration to predict collisions or future distances.  
- Use the provided data to implement collision avoidance strategies in PLC-controlled systems.


