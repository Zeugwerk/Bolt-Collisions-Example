<div align="center">
<img width="384" height="256" alt="image" src="https://github.com/user-attachments/assets/e757a820-07a7-4982-a6df-6e3d4e35683f" />
</div>

# Bolt

**Bolt** provides **real-time collision detection and avoidance** in industrial automation applications. It allows PLCs to communicate with a physics engine to obtain detailed information about moving objects and their environment, enabling dynamic trajectory management and motion coordination. It supports

- Scene descriptions via [URDF](https://wiki.ros.org/urdf/XML/model)
- Real-time collision queries
- Closest distance calculation
- Predictive queries by passing current velocity and acceleration to predict collisions or future distances.  
- Use the provided data to implement collision avoidance strategies in PLC-controlled systems.

## Requirements

- TwinCAT PLC runtime
- Zeugwerk-Framework (Trial License via [Zeugwerk Development Kit] works as well)

## How It Works

1. **PLC Integration**  
Bolt runs on a TwinCAT PLC and communicates via **ADS** with a server-side physics engine. A simple Function Block takes care of connecting to the server and sending commands to it.

2. **Physics Engine**  
  The server implements a physics engine, doing all the heavy lifting like

    - handling real-time object simulation and
    - collision computations  

4. **Collision and Distance Queries**  
 The PLC can query:
   - Whether objects are in collision  
   - Closest points between objects  
   - Normals of object surfaces  

5. **Predictive Queries**  
   By passing **current velocity and acceleration**, the PLC can request predictions of future collisions or distances.  

6. **Collision Avoidance Implementation**  
   Using Bolt’s real-time feedback, the PLC can **adjust trajectories, velocities, or paths** to avoid collisions dynamically.  



