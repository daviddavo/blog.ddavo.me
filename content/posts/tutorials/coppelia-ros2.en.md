---
title: Using ROS2 in Coppelia
date: 2022-12-13T15:25:49.194Z
author: David Davó
tags:
  - tutorial
  - ROS2
  - Coppelia
  - Robotics
categories:
  - tutorial
showToc: true
draft: true
keywords:
  - lidar
  - pointcloud
  - ros2
  - coppelia
  - rviz
  - vrep
slug: ros2-coppelia
description: With this tutorial you will learn how to use ROS2 in the Coppelia simulator
  (formerly V-REP) with the simExtROS2 library, publishing transforms and
  messages.
---

## Introduction

Let's be honest, if you're here its probably because you found this blog on Google.
As I understand it, at the moment there is no comprehensible resources to use
ROS2 with the Coppelia simulator (previously known as V-REP), and it is no simple task.

In this tutorial, we will make a simple project using a Pioneer P3DX with a Lidar, in which we
will use *Slam Toolbox* to create a map of the room, all using ROS2 tools like RVIZ2
and NAV2's Slam Toolbox, but using Coppelia as a simulator instead of Gazebo.

The end product will look something like this:

{{< youtube SYblPjsOgAM >}}

I made it work but I'm no expert in robotics, so if I made some error, please let
me know in the comments or [on GitHub](https://github.com/daviddavo/blog.ddavo.me).

I will center on the programming part, because the way of adding a robot and a lidar is the same wether you're using ROS2 or not.

> The original project was made as homework for the Master Universitario en Inteligencia Articial (MUIA) at Universidad Politécnica de Madrid (UPM)

## Installing simExtROS2

ROS2 works by creating publishers and subscribers that emit and receive messages of a _message type_. To be able to do this from Coppelia, we will use the module [simExtROS2](https://github.com/CoppeliaRobotics/simExtROS2).

Coppelia comes with this module installed, but it's compiled with too few message types embeded.
If you try publishing some sensor data, it will fail. You need to modify a config file from the source code and
compile it again so it supports that message type.

First, we will download the source code. Because I'm using Coppelia 4.4.0, I'll checkout to that version too. Feel free to change the version number if you need to.

```bash
git clone --recursive https://github.com/CoppeliaRobotics/simExtROS2.git
# according to the docs, we have to rename the folder
mv simExtROS2 sim_ros2_interface
git checkout coppeliasim-v4.4.0-rev0
```

Before compiling, we need to modify a config file to specify the message types you want to compile. This file is `meta/interfaces.txt`, and in my case it ended up with the following contents:

{{< collapse "`meta/interfaces.txt`">}}
```
builtin_interfaces/msg/Duration
builtin_interfaces/msg/Time
rosgraph_msgs/msg/Clock
geometry_msgs/msg/Quaternion
geometry_msgs/msg/Transform
geometry_msgs/msg/TransformStamped
geometry_msgs/msg/Vector3
geometry_msgs/msg/Point
geometry_msgs/msg/Pose
geometry_msgs/msg/PoseStamped
geometry_msgs/msg/Twist
geometry_msgs/msg/PoseWithCovariance
geometry_msgs/msg/TwistWithCovariance
sensor_msgs/msg/Image
sensor_msgs/msg/PointCloud2
sensor_msgs/msg/PointField
sensor_msgs/msg/LaserScan
std_msgs/msg/Bool
std_msgs/msg/Byte
std_msgs/msg/ColorRGBA
std_msgs/msg/Empty
std_msgs/msg/Float32
std_msgs/msg/Float64
std_msgs/msg/Header
std_msgs/msg/Int8
std_msgs/msg/Int16
std_msgs/msg/Int32
std_msgs/msg/Int64
std_msgs/msg/String
std_msgs/msg/UInt8
std_msgs/msg/UInt16
std_msgs/msg/UInt32
std_msgs/msg/UInt64
std_srvs/srv/Empty
std_srvs/srv/SetBool
std_srvs/srv/Trigger
nav_msgs/msg/Odometry
```
{{< /collapse >}}

Before compiling, you will have to add the following enviroment variable, either modifying ros' `setup.bash` or your `.bashrc`. 

```bash
export COPPELIASIM_ROOT_DIR="<your coppelia installation path>"
```

Now we can proceed to compile and install the library

### Compiling libsimExtROS2

After downloading everything, we can install it with _colcon_, using the following command:

```bash
colcon build --symlink-install
```

This will take lots of resources and will take up a while the first time, but don't worry, it will finish and install it.

## Modifications in Coppelia

### Publishing the simulation time

We can't use a "wall clock" because the simulation is not in real time. Let's imagine
you implement an odometry module, and you try to calculate your speed by substracting
your current position from a previous position, and dividing by the number of seconds
elapsed. This formula will be wrong if your simulation is a bit slow, or if it is too fast.
That's why we need to publish Coppelia's simulation time into the topic `/clock`.

```lua
function sysCall_init()
  ...
  simTimePub=simROS2.createPublisher('/clock','rosgraph_msgs/msg/Clock')
  ...
end

function sysCall_actuation()
  ...
  t=sim.getSimulationTime()
  simROS2.publish(simTimePub, {clock={
    sec=math.floor(t),
    nanosec=(t-math.floor(t))*10^9}}
  )
  ...
end

function sysCall_cleanup()
  ...
  simROS2.shutdownPublisher(simTimePub)
  ...
end
```

### Publishing transforms

The transforms allow ROS modules to calculate the exact distance between any two objects, publishing just the partial distances. For example, we can publish the distance of the laser's reference frame to the robot, and ROS is able to calculate the distance from the laser to anything automatically.

![Image of the robot transforms](https://navigation.ros.org/_images/simple_robot.png)

![Another sample iamge of how the transforms work](https://navigation.ros.org/_images/tf_robot.png)

Each published transform has a parent, and the _root_ of this hierarchy is the transform that is not published (it is just referenced as a parent). According to the standard [REP105](https://www.ros.org/reps/rep-0105.html), this root should be `world` or `map` if we have just one robot.

We will publish the following transforms:
- From the lidar frame to the robot frame
- From the robot to odometry frame
- From the wheels to the robot frame (needed to display the robot in the simulator)

The final transform, from the odometry frame to the world map is published by another module, so we won't send it from coppelia.

To publish all these transforms, we use the following code (remember to change the constants as needed):

```lua
function getTransformStamped(objHandle,name,relTo,relToName)
  p=sim.getObjectPosition(objHandle,relTo)
  o=sim.getObjectQuaternion(objHandle,relTo)
  return {
    header={
      stamp=simROS2.getSimulationTime(),
      frame_id=relToName
    },
    child_frame_id=name,
    transform={
      translation={x=p[1],y=p[2],z=p[3]},
      rotation={x=o[1],y=o[2],z=o[3],w=o[4]}
    }
  }
end

function sysCall_actuation()
  ...
  simROS2.sendTransforms({
    getTransformStamped(robotHandle, ROBOT_FRAME_ID, -1, PODOM_FRAME_ID),
    getTransformStamped(leftWheel, 'Pioneer_p3dx_leftWheel', robotHandle, ROBOT_FRAME_ID),
    getTransformStamped(rightWheel, 'Pioneer_p3dx_rightWheel', robotHandle,ROBOT_FRAME_ID),
    getTransformStamped(caster_link, 'Pioneer_p3dx_caster_link', robotHandle, ROBOT_FRAME_ID),
    getTransformStamped(caster_wheel, 'Pioneer_p3dx_caster_wheel', caster_link, 'Pioneer_p3dx_caster_link'),
    getTransformStamped(sensorRefHandle, SENSOR_REF_FRAME, robotHandle, ROBOT_FRAME_ID),
  })
  ...
end
```

### Publishing Lidar pointcloud

The lidar we used returns a pointcloud in Coppelia's signal `Pioneer_p3dx_lidar_data`. This pointcloud is an array of triplets of floats, each triplet representing the x, y, z coordinates of each point. We want to publish this data in a topic of type [`sensor_msgs/msg/PointCloud2`](https://docs.ros2.org/foxy/api/sensor_msgs/msg/PointCloud2.html).

This message needs us to send a stream of binary data and specify the type of this data in the parameter `fields`. We will see exactly how with the following commented code:

```lua
function sysCall_init()
  ...
  lidarDataTopicName = '/lidarPC'
  lidarDataPub=simROS2.createPublisher(lidarDataTopicName, 'sensor_msgs/msg/PointCloud2')
  ...
end

function sysCall_actuation()
  ...
  lidar_signal = 'Pioneer_p3dx_lidar_data'

  -- Get binary data from signal
  data = sim.getStringSignal(lidar_signal)

  if (data == nil or #data == 0) then
    -- It's normal for this to happend in the first iteration of simulation
    sim.addLog(sim.verbosity_scripterrors, 'signal name ' .. lidar_signal .. ', returned nil value')
  else
    -- Unpack binary data as array of floats
    floats = sim.unpackFloatTable(data)

    -- Each point is 3 floats, so the number of points
    -- is number of floats / 3
    n = #floats//3

    simROS2.publish(lidarDataPub, {
      header={
        stamp=simROS2.getSimulationTime(),
        frame_id='lidar_ref_frame',
      },
      height=1,
      -- Number of points (not bytes)
      width=n,
      -- Each point is 3*4 = 12 bytes
      point_step=12,
      fields={
        -- datatype 7 is FLOAT32
        -- the offset is in BYTES
        {name='x', offset=0, datatype=7, count=1},
        {name='y', offset=4, datatype=7, count=1},
        {name='z', offset=8, datatype=7, count=1},
      },
      -- Unpack data as bytes (uint8)
      data=sim.unpackUInt8Table(data),
    })
  end
  ...
end
```

After all of this, the PointCloud message will be available on the topic `/lidarPC`

## ROS2 and RVIZ

The main advantage of using ROS2 instead of programming the behaviour of our robot
directly on Coppelia is that ROS2 is platform agnostic and we can use it with any simulator, and even with a real robot.

The system has just 3 nodes:
- `pointcloud_to_laserscan`: It transforms the data from type _Pointcloud2_ to _LaserScan_ so Slam Toolbox is able to use it.
- `async_toolbox_node`: Makes a map and localizes the robot in the map.

<!-- TODO: Use the keyboard thing -->

<!-- TODO: The tutorial on how to generate the URDF -->

<!-- TODO: The tutorial on how to use RVIZ2 -->
 
<!-- TODO: The tutorial on how to use a launch file -->
 
## Sources and more information
- [GitHub - coppeliaRobotics/simExtROS2](https://github.com/CoppeliaRobotics/simExtROS2)
- [ROS Planning. Setting Up Transformations](https://navigation.ros.org/setup_guides/transformation/setup_transforms.html)
- [REP 105 -- Coordinate Frames for Mobile Platforms](https://www.ros.org/reps/rep-0105.html)
 