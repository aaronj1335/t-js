version 0.0.1

overview
========
t.js is a tree-traversal library.  its only assumption is that the trees it
traverses are made up of objects with 'children' arrays:

     {
         children: [
             { },
             {
                 children: [
                     { },
                     { }
                 ]
             }
         ]
     }

testing
-------
unit tests are provided courtesy of
[`mocha.js`](http://visionmedia.github.com/mocha/) and
[`chai`](http://chaijs.com/).  on a unix system they can be run from the
command line with:

     $ make test

or viewed in most any system with a modern browser by opening the
`index.html` file.

documentation is generated with the `make readme` target.

usage
-----
the `t` interface is exported in either the browser or server.  (got this
from [`underscore.js`](http://documentcloud.github.com/underscore/))

available functions
===================

t.dfs()
-------
perform a depth-first search, executing the given callback at each node.

     t.dfs(node, [config], function(node, par, ctrl) {
         /* ... */
     })

- `node`:
     object where the search will start.  this could also be an array of
     objects
- `config`:
     this is used for specifying things like pre/post order traversal
     (currently not implemented)
- `callback` (last argument):
     function to be executed at each node.  the arguments are:
     - `node`: the current node
     - `par`: the current node's parent
     - `ctrl`: control object.  setting the `stop` property of this will end
     the search, setting the `cutoff` property of this will not visit any
     children of this node

t.map()
-------
given a tree, return a tree of the same structure made up of the objects
returned by the callback which is executed at each node.  think of the
`underscore`'s `_.map()` function, or python's `map()`

     t.map(node, [config], function(node, par) {
         /* ... */
     })

- `node`:
     object where the traversal will start.  this could also be an array of
     objects
- `config`:
     this is used for specifying things like pre/post order traversal
     (currently not implemented)
- `callback` (last argument):
     function to be executed at each node.  this must return an object.  the
     `map` function takes care of setting children.  the arguments are:
     - `node`: the current node
     - `par`: the current node's parent. note that this is the parent from
     the new tree that's being created.

t.filter()
----------
given a tree, return a tree of the same structure made up of the objects
returned by the callback which is executed at each node.  if, however, at a
given node the callback returns a falsy value, then the current node and all
of its descendents will be pruned from the output tree.

     t.filter(node, function(node, par) {
         /* ... */
     })

- `node`:
     object where the traversal will start.  this could also be an array of
     objects
- `callback` (last argument):
     function to be executed at each node.  this must return an object or a
     falsy value if the output tree should be pruned from the current node
     down.  the `filter` function takes care of setting children.  the
     arguments are:
     - `node`: the current node
     - `par`: the current node's parent. note that this is the parent from
     the new tree that's being created.

t.stroll()
----------

_a walk through the trees..._

given two trees of similar structure, traverse both trees at the same time,
executing the given callback with the pair of corresponding nodes as
arguments.

     t.stroll(tree1, tree2, function(node1, node2) {
         /* ... */
     })

- `tree1`:
     the first tree of the traversal
- `node2`:
     the second tree of the traversal
- `callback` (last argument):
     function to be executed at each node. the arguments are:
     - `node1`: the node from the first tree
     - `node2`: the node from the second tree

t.find()
----------

given a tree and a truth test, return the first node that responds with a
truthy value

     t.find(tree, function(node, par) {
         /* ... */
     })

- `tree`:
     the tree in which to find the node
- `callback` (last argument):
     function to be executed at each node. if this function returns a truthy
     value, the traversal will stop and `find` will return the current node.
     the arguments are:
     - `node`: the current node
     - `par`: the parent of the current node

credits
-------
this library is of course heavily inspired by the work of @jashkenas and
others on `underscore`.  it is also built on the foundations laid by
@tjholowaychuk, the jQuery team, and @jakeluer.
