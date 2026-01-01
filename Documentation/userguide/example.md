# Example

This example shows how to use the *Bolt collision avoidance library* to update a URDF-based collision world, synchronize joint positions, and check for imminent collisions.

The scene is updated asynchronously, and the minimum distance to a link is monitored to trigger collision avoidance actions when a safety threshold is reached. 

When a collision risk is detected, typical avoidance strategies include stopping the motion, slowing down based on distance, rerouting the trajectory, or using a distance-based controller to keep a safe separation from obstacles.

```std
PROGRAM Example
VAR_INPUT
  _context : ZApplication.Context(displayName := 'Simple-Bolt-Example');
  _axis1 : ZEquipment.AxisSimulated(parent := _context);
  _world  : Bolt.CollisionWorld('C:\example\world.urdf', parent := _context);
  _joint1 : Bolt.Joint('joint1');
  _box1   : Bolt.Link('link1');
END_VAR
```
```sti
context.Cyclic();

// pass the position of the joint here
_joint1.SetPosition(_axis1.ActualPosition);

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

---

```xml
<!-- C:\example\world.urdf -->
<?xml version="1.0"?>
<robot name="collision_demo">

  <!-- Table -->
  <link name="table">
    <visual>
      <geometry>
        <box size="3.0 3.0 0.05"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <material name="brown"/>
    </visual>
    <collision>
      <geometry>
        <box size="3.0 3.0 0.05"/>
      </geometry>
      <origin xyz="0 0 0" rpy="0 0 0"/>
    </collision>
  </link>

  <!-- Base link of manipulator -->
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.1"/>
      </geometry>
      <origin xyz="0 0 0.05" rpy="0 0 0"/>
      <material name="gray"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.1"/>
      </geometry>
      <origin xyz="0 0 0.05" rpy="0 0 0"/>
    </collision>
  </link>

  <!-- Joint 1 -->
  <joint name="joint1" type="revolute">
    <parent link="table"/>
    <child link="base_link"/>
    <origin xyz="0.1 0.1 0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="10" velocity="1"/>    
  </joint>

  <!-- Link 1 -->
  <link name="link1">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <origin xyz="0 0 0.15" rpy="0 0 0"/>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <origin xyz="0 0 0.15" rpy="0 0 0"/>
    </collision>
  </link>

</robot>

```
