// version 0.1.1
//

// overview
// ========
// t.js is a tree-traversal library.  its only assumption is that the trees it
// traverses are made up of objects with 'children' arrays:
//
//      {
//          children: [
//              { },
//              {
//                  children: [
//                      { },
//                      { }
//                  ]
//              }
//          ]
//      }
//
// testing
// -------
// unit tests are provided courtesy of
// [`mocha.js`](http://visionmedia.github.com/mocha/) and
// [`chai`](http://chaijs.com/).  on a unix system they can be run from the
// command line with:
//
//      $ make test
//
// or viewed in most any system with a modern browser by opening the
// `index.html` file.
//
// documentation is generated with the `make readme` target.
//
(function() {


// usage
// -----
// the `t` interface is exported in either the browser or server.  (got this
// from [`underscore.js`](http://documentcloud.github.com/underscore/))
//
var t = {};

/*global exports:true, module:true, define*/
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = t;
    }
    exports.t = t;
} else if (typeof define === 'function' && define.amd) {
    // if using an AMD library like [`require.js`](http://requirejs.org/), the
    // library is exported with path `t`
    define('t', function() {
        return t;
    });
}

var isArray = function(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
};


// available functions
// ===================
//
// t.dfs()
// -------
// perform a depth-first search, executing the given callback at each node.
//
//      t.dfs(node, [config], function(node, par, ctrl) {
//          /* ... */
//      })
//
// - `node`:
//      object where the search will start.  this could also be an array of
//      objects
// - `config`:
//      this is used for specifying things like pre/post order traversal
//      (currently not implemented)
// - `callback` (last argument):
//      function to be executed at each node.  the arguments are:
//      - `node`: the current node
//      - `par`: the current node's parent
//      - `ctrl`: control object.  setting the `stop` property of this will end
//      the search, setting the `cutoff` property of this will not visit any
//      children of this node
//
t.dfs = function() {
    var cur, par, children, ctrl, i, numArgs = arguments.length,
        node = arguments[0],
        nodes = isArray(node)? node.slice(0).reverse() : [node],
        config = numArgs === 3? arguments[1] : {},
        callback = arguments[numArgs === 3? 2 : 1],
        parents = [];

    for (i = nodes.length-1; i >= 0; i--)
        parents.push(undefined);

    while (nodes.length > 0) {
        cur = nodes.pop();
        par = parents.pop();

        ctrl = {};
        callback.call(cur, cur, par, ctrl);

        if (ctrl.stop) break;

        children = cur.children? cur.children : [];

        for (i = ctrl.cutoff? -1 : children.length-1; i >= 0; i--) {
            nodes.push(children[i]);
            parents.push(cur);
        }
    }
};

// t.map()
// -------
// given a tree, return a tree of the same structure made up of the objects
// returned by the callback which is executed at each node.  think of the
// `underscore`'s `_.map()` function, or python's `map()`
//
//      t.map(node, [config], function(node, par) {
//          /* ... */
//      })
//
// - `node`:
//      object where the traversal will start.  this could also be an array of
//      objects
// - `config`:
//      this is used for specifying things like pre/post order traversal
//      (currently not implemented)
// - `callback` (last argument):
//      function to be executed at each node.  this must return an object.  the
//      `map` function takes care of setting children.  the arguments are:
//      - `node`: the current node
//      - `par`: the current node's parent. note that this is the parent from
//      the new tree that's being created.
//
t.map = function() {
    var node = arguments[0],
        numArgs = arguments.length,
        config = numArgs === 3? arguments[1] : {},
        filter = config.filter,
        nodeFactory = arguments[numArgs === 3? 2 : 1],
        ret = isArray(node)? [] : undefined,
        last = function(l) { return l[l.length-1]; },
        parentStack = [];

    t.dfs(node, function(n, par, ctrl) {
        var curParent = last(parentStack),
            newNode = nodeFactory(n, curParent? curParent.ret : undefined);

        if (filter && ! newNode) {
            ctrl.cutoff = true;
            if (curParent && n === last(curParent.n.children)) {
                parentStack.pop();
                if (curParent.ret.children && ! curParent.ret.children.length)
                    delete curParent.ret.children;
            }
            return;
        }

        if (! par) {
            if (isArray(node))
                ret.push(newNode);
            else
                ret = newNode;

        } else {
            curParent.ret.children.push(newNode);

            if (n === last(curParent.n.children)) {
                parentStack.pop();
                if (curParent.ret.children && ! curParent.ret.children.length)
                    delete curParent.ret.children;
            }
        }

        if (n.children && n.children.length) {
            newNode.children = [];
            parentStack.push({n: n, ret: newNode});
        }
    });

    return ret;
};

// t.filter()
// ----------
// given a tree, return a tree of the same structure made up of the objects
// returned by the callback which is executed at each node.  if, however, at a
// given node the callback returns a falsy value, then the current node and all
// of its descendents will be pruned from the output tree.
//
//      t.filter(node, function(node, par) {
//          /* ... */
//      })
//
// - `node`:
//      object where the traversal will start.  this could also be an array of
//      objects
// - `callback` (last argument):
//      function to be executed at each node.  this must return an object or a
//      falsy value if the output tree should be pruned from the current node
//      down.  the `filter` function takes care of setting children.  the
//      arguments are:
//      - `node`: the current node
//      - `par`: the current node's parent. note that this is the parent from
//      the new tree that's being created.
//
t.filter = function(node, nodeFactory) {
    return t.map(node, {filter: true}, nodeFactory);
};

// t.stroll()
// ----------
//
// _a walk through the trees..._
//
// given two trees of similar structure, traverse both trees at the same time,
// executing the given callback with the pair of corresponding nodes as
// arguments.
//
//      t.stroll(tree1, tree2, function(node1, node2) {
//          /* ... */
//      })
//
// - `tree1`:
//      the first tree of the traversal
// - `node2`:
//      the second tree of the traversal
// - `callback` (last argument):
//      function to be executed at each node. the arguments are:
//      - `node1`: the node from the first tree
//      - `node2`: the node from the second tree
//
t.stroll = function(tree1, tree2, callback) {
    var i, children, node2,
        nodes2 = isArray(tree2)? tree2.slice(0).reverse() : [tree2],
        len = function(a) { return typeof a === 'undefined'? 0 : a.length; };

    t.dfs(tree1, function(node1, par, ctrl) {
        node2 = nodes2.pop();

        callback(node1, node2);

        if (len(node1.children) === len(node2.children))
            for (i = (node2.children || []).length-1; i >= 0; i--)
                nodes2.push(node2.children[i]);
        else
            ctrl.cutoff = true;

    });
};

// t.find()
// ----------
//
// given a tree and a truth test, return the first node that responds with a
// truthy value
//
//      t.find(tree, function(node, par) {
//          /* ... */
//      })
//
// - `tree`:
//      the tree in which to find the node
// - `callback` (last argument):
//      function to be executed at each node. if this function returns a truthy
//      value, the traversal will stop and `find` will return the current node.
//      the arguments are:
//      - `node`: the current node
//      - `par`: the parent of the current node
//
t.find = function(tree, callback) {
    var found;

    t.dfs(tree, function(node, par, ctrl) {
        if (callback.call(node, node, par)) {
            ctrl.stop = true;
            found = this;
        }
    });

    return found;
};

// credits
// -------
// this library is of course heavily inspired by the work of @jashkenas and
// others on `underscore`.  it is also built on the foundations laid by
// @tjholowaychuk, the jQuery team, and @jakeluer.

}());
