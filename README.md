** WORK IN PROGESS, STAY TUNED**


<div align="center">
<img width="300" height="300" alt="Bolt_white" src="https://github.com/user-attachments/assets/74ba93dc-e87f-4406-a71e-7095d742c9ef" />
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
- Zeugwerk-Framework (Trial License via [Zeugwerk Development Kit](https://github.com/Zeugwerk/Zeugwerk-Development-Kit) works as well)

## Example

This example shows how to use the *Bolt collision avoidance library* to update a URDF-based collision world, synchronize joint positions, and check for imminent collisions.

The scene is updated asynchronously, and the minimum distance to a link is monitored to trigger collision avoidance actions when a safety threshold is reached. 

When a collision risk is detected, typical avoidance strategies include stopping the motion, slowing down based on distance, rerouting the trajectory, or using a distance-based controller to keep a safe separation from obstacles.

``` st
PROGRAM Example
VAR_INPUT
  _world  : Bolt.CollisionWorld('C:\example\world.urdf, parent := Context);
  _joint1 : Bolt.Joint('joint1');
  _box1   : Bolt.Link('box1');
END_VAR

// pass the position of the joint here
_joint1.SetPosition(Context.Axis1.ActualPosition);

// permanently update world coordinates in physics engine
// and check for collisions, calculate normal collision distances
IF NOT _world.Busy
THEN
  _world.UpdateAndCheckWholeSceneAsync(startToken := 0);
END_IF

// check for incoming collisions and react
IF _box1.FindMinimumDistance() < 0.005
THEN
  ; // collision is imminent, counter-measures (stop, avoid, use distance controller, ...) here
END_IF
```


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



