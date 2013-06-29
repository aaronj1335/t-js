// version 0.4.0 ([source](https://github.com/aaronj1335/t-js))
//
// t-js is freely distributable under the MIT license
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
//  it's entirely non-recursive, including the post-order traversal and `map()`
//  functions, and it works inside the browser or out.
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
// the `t` interface is exported in either the browser or node.js.  (got this
// from [`underscore.js`](http://documentcloud.github.com/underscore/)).  the
// library can be installed from [npm](http://search.npmjs.org/#/t):
//
//     $ npm install t
//
var _dfsPostOrder,
    t = {},
    root = this,
    isArray = function(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },
    getChildrenName = function ( config ) {
       return config.childrenName || 'children';
    };

/*global exports:true, module:true, define*/
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = t;
    }
    exports.t = t;
} else {
    root['t'] = t;
}


// available functions
// ===================

// t.bfs()
// -------
// perform a breadth-first search, executing the given callback at each node.
//
//      t.bfs(node, [config], function(node, par, ctrl) {
//          /* ... */
//      })
//
// - `node`:
//      object where the search will start.  this could also be an array of
//      objects
// - `config`:
//      this currently doesn't do anything for breadth-first searches
// - `callback` (last argument):
//      function to be executed at each node.  the arguments are:
//      - `node`: the current node
//      - `par`: the current node's parent
//      - `ctrl`: control object.  this doesn't currently do anything.
//
//  returns: the first `node` argument
//
t.bfs = function(node) {

    var cur, callback, i, length, par,
        isConfigSet = arguments.length === 3,
        config = isConfigSet ? arguments[1] : {},
        queue = isArray(node)? node.slice(0) : [node],
        parents = [undefined],
        childrenName = getChildrenName(config);

    if (node == null) return node;

    if (arguments.length >= 3) {
        config = arguments[1];
        callback = arguments[2];
    } else {
        config = {};
        callback = arguments[1];
    }

    while (queue.length) {
        cur = queue.shift();
        par = parents.shift();
        callback.call(cur, cur, par);
        children = cur[childrenName] || [];
        for (i = 0, length = children.length; i < length; i++) {
            queue.push(children[i]);
            parents.push(cur);
        }
    }

    return node;
};

// t.dfs()
// -------
// perform a depth-first search, executing the given callback at each node.
//
//      t.dfs(node, [config], function(node, par, ctrl) {
//          /* ... */
//      })
//
//  in the pre-order case, `dfs()` doesn't process child nodes until after the
//  callback.  so if you need to traverse an unknown tree, say a directory
//  structure, you can start with just the root, and add child nodes as you go
//  by appending them to `this.children` in the callback function.
//
// - `node`:
//      object where the search will start.  this could also be an array of
//      objects
// - `config`:
//      if this is an object w/ the 'order' property set to 'post', a
//      post-order traversal will be performed.  this is generally worse
//      performance, but the `callback` has access to the return values of its
//      child nodes.
// - `callback` (last argument):
//      function to be executed at each node.  the arguments are:
//      - `node`: the current node
//      - `par`: the current node's parent
//      - `ctrl`: control object.  setting the `stop` property of this will end
//      the search, setting the `cutoff` property of this will not visit any
//      children of this node
//      - `ret`: return values of child nodes.  this is only set if `dfs()` is
//      called with the `order` property set to `post`.
//
//  returns: the first `node` argument
//
t.dfs = function(node) {
    var cur, par, children, ctrl, i, ret,
        isConfigSet = arguments.length === 3,
        nodes = isArray(node)? node.slice(0).reverse() : [node],
        config = isConfigSet ? arguments[1] : {},
        callback = arguments[isConfigSet ? 2 : 1],
        parents = [],
        childrenName = getChildrenName(config);
    if (typeof nodes[0] === 'undefined' && nodes.length === 1) return;

    if (config.order === 'post') {
        ret = _dfsPostOrder(nodes, config, callback);
        return isArray(node)? ret : ret[0];
    }


    for (i = nodes.length-1; i >= 0; i--)
        parents.push(undefined);

    while (nodes.length > 0) {
        cur = nodes.pop();
        par = parents.pop();

        ctrl = {};
        callback.call(cur, cur, par, ctrl);

        if (ctrl.stop) break;

        children = (cur && cur[childrenName])? cur[childrenName] : [];

        for (i = ctrl.cutoff? -1 : children.length-1; i >= 0; i--) {
            nodes.push(children[i]);
            parents.push(cur);
        }
    }

    return node;
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
//  returns: a new tree, mapped by the callback function
//
t.map = function() {
    var node = arguments[0],
        isConfigSet = arguments.length === 3,
        config = isConfigSet ? arguments[1] : {},
        filter = config.filter,
        nodeFactory = arguments[isConfigSet ? 2 : 1],
        ret = isArray(node)? [] : undefined,
        last = function(l) { return l[l.length-1]; },
        parentStack = [],
        childrenName = getChildrenName(config);

    t.dfs(node, config, function(n, par, ctrl) {
        var curParent = last(parentStack),
            newNode = nodeFactory(n, curParent? curParent.ret : undefined);

        if (filter && ! newNode) {
            ctrl.cutoff = true;
            if (curParent && n === last(curParent.n[childrenName])) {
                parentStack.pop();
                if (curParent.ret[childrenName] && ! curParent.ret[childrenName].length)
                    delete curParent.ret[childrenName];
            }
            return;
        }

        if (! par) {
            if (isArray(node))
                ret.push(newNode);
            else
                ret = newNode;

        } else {
            curParent.ret[childrenName].push(newNode);

            if (n === last(curParent.n[childrenName])) {
                parentStack.pop();
                if (curParent.ret[childrenName] && ! curParent.ret[childrenName].length)
                    delete curParent.ret[childrenName];
            }
        }

        if (n[childrenName] && n[childrenName].length) {
            newNode[childrenName] = [];
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
// returns: a new tree, filtered by the callback function
//
t.filter = function(node) {
    var isConfigSet = arguments.length === 3,
        nodeFactory =  arguments[isConfigSet ? 2 : 1];
        config = isConfigSet ? arguments[1] : {};
    return t.map(node, {
        filter: true,
        childrenName: config.childrenName
    }, nodeFactory);
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
t.stroll = function(tree1, tree2) {
    var i, children, node2,
        isConfigSet = arguments.length === 4,
        callback =  arguments[ isConfigSet ? 3 : 2],
        config = isConfigSet ? arguments[2] : {},
        childrenName = getChildrenName(config),
        nodes2 = isArray(tree2)? tree2.slice(0).reverse() : [tree2],
        len = function(a) { return typeof a === 'undefined'? 0 : a.length; };
      
    t.dfs(tree1, config, function(node1, par, ctrl) {
        node2 = nodes2.pop();

        callback(node1, node2);

        if (node1 && node2 && len(node1[childrenName]) === len(node2[childrenName]))
            for (i = (node2[childrenName] || []).length-1; i >= 0; i--)
                nodes2.push(node2[childrenName][i]);
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
// returns: the found node
//
t.find = function( tree ) {
    var found,
        isConfigSet = arguments.length === 3,
        callback =  arguments[ isConfigSet ? 2 : 1],
        config = isConfigSet ? arguments[1] : {};
    t.dfs(tree, config, function(node, par, ctrl) {

        if (callback.call(node, node, par)) {
            ctrl.stop = true;
            found = this;
        }
    });

    return found;
};

// _dfsPostOrder()
// -----------------
//
// this is a module-private function used by `dfs()`
_dfsPostOrder = function(nodes, config, callback) {
    var cur, par, ctrl, node, i,
        last = function(l) { return l[l.length-1]; },
        ret = [],
        stack = [{
            node: nodes.pop(),
            index: 0,
            ret: []
        }],
        childrenName = getChildrenName(config);

    while (stack.length) {
        cur = last(stack);
        node = cur.node;

        if (node[childrenName] && node[childrenName].length) {
            if (cur.index < node[childrenName].length) {
                stack.push({
                    node: node[childrenName][cur.index++],
                    index: 0,
                    ret: []
                });
                continue;
            }
        }

        ctrl = {};
        par = stack[stack.length-2];
        if (par) {
            par.ret.push(callback.call(node, node, par.node, ctrl, cur.ret));
            stack.pop();
        } else {
            ret.push(callback.call(node, node, undefined, ctrl, cur.ret));
            stack.pop();
            if (nodes.length)
                stack.push({
                    node: nodes.pop(),
                    index: 0,
                    ret: []
                });
        }
    }

    return ret;
};

// credits
// -------
// this library is of course heavily inspired by the work of
// [@jashkenas](https://twitter.com/#!/jashkenas) and others on `underscore`.
// it also makes use of the hard work by folks like
// [@tjholowaychuk](https://twitter.com/#!/tjholowaychuk), the jQuery team, and
// [@jakeluer](https://twitter.com/#!/jakeluer).

}());
