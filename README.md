Polymer BulletGraph
=========

A BulletGraph Web Component implemented using Polymer.  Based on [D3js BulletGraph] implementation.  Still currently as a dependency on D3 which I'm not taking full advantage of.  My plan is to remove the dependency, I'm currently using it only to calculate scales.  But alternately I might use it for animations and such.  Or maybe I'll just make a version of each.

TODO:
-----------
  - Remove [d3js] dependency (or take better advantage of it)
  - Improve animations, especailly on partial data update
  - Converge onto a single 'style'
  - Find/fix other problems

Individual Bullet
----
> An individual bullet graph, component piece of larger bullet graph.

![lonebullet](./lonebullet.png)


BulletGraph
----
> Bullet Graph takes data for multiple bullets, and displays appropriate graphs.

![bulletgraph](./bulletGraph.png)

## Notes
I use multiple styles.  For bullet- I have the css/js/html all split out into there own files.  To me this feels more natural, though admittedly, I should probably use a more meaningful folder structure.  For bullet-graph all markup/code is in a single file, most example code looks more like this.  I'm not 100% sure if this is because it tends to be small, or by design.

[D3js BulletGraph]:http://bl.ocks.org/mbostock/4061961
[d3js]:http://d3js.org



