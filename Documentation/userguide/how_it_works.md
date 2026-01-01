# How It Works

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
