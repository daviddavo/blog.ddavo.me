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

Let's be honest, if you're here its probably because you found this blog on Google.
As I understand it, at the moment there is no comprehensible resources to use
ROS2 with the Coppelia simulator (previously known as V-REP), and it is no simple task.

In this tutorial, we will make a simple project using a Pioneer P3DX with a Lidar, in which we
will use *Slam Toolbox* to create a map of the room, all using ROS2 tools like RVIZ2
and NAV2's Slam Toolbox, but using Coppelia as a simulator instead of Gazebo.

The end product will look something like this:

<!-- TODO: Put the YouTube video -->

I made it work but I'm no expert in robotics, so if I made some error, please let
me know in the comments or [on GitHub](https://github.com/daviddavo/blog.ddavo.me).

<!-- TODO: Add the table of contents -->

<!-- TODO: Talk about how I will only explain the programming part -->
<!-- But if you don't know much about ROS2 I will be linking to more resources as I write -->

## Installing simExtROS2

Coppelia comes with this module installed, but it's compiled with too few message types embeded.
If you try publishing some sensor data, it will fail. You need to modify a source code file and
compile it again so it supports that message type.

<!-- TODO: The tutorial on how to install it -->

## Publishing the simulation time

We can't use a "wall clock" because the simulation is not in real time. Let's imagine
you implement an odometry module, and you try to calculate your speed by substracting
your current position from a previous position, and dividing by the number of seconds
elapsed. This formula will be wrong if your simulation is a bit slow, or if it is too fast.
That's why we need to publish the simulation time.

<!-- TODO: The tutorial on how to publish it -->

<!-- TODO: The tutorial on how to publish transforms -->

<!-- TODO: The tutorial on how to generate the URDF -->

<!-- TODO: The tutorial on how to publish lidar data using LaserScan -->

<!-- TODO: The tutorial on how to publish lidar data using PointCloud -->

<!-- TODO: The tutorial on how to use RVIZ2 -->
 
<!-- TODO: The tutorial on how to use a launch file -->
 