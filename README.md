Polymer BulletGraph
=========

A BulletGraph Web Component implemented using Polymer.  Based on [D3js BulletGraph] implementation.  Still currently as a dependency on D3 which I'm not taking full advantage of.  My plan is to remove the dependency, I'm currently using it only to calculate scales.  But alternately I might use it for animations and such.  Or maybe I'll just make a version of each.

TODO:
-----------
  - Remove [d3js] dependency (or take better advantage of it)
  - Improve animations, especailly on partial data update
  - Find/fix other problems

Individual Bullet
----
> An individual bullet graph, component piece of larger bullet graph.

![lonebullet](./lonebullet.png)


BulletGraph
----
> Bullet Graph takes data for multiple bullets, and displays appropriate graphs.

![bulletgraph](./bulletGraph.png)