# Example

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
