(function() {


var t = {};

// export the t interface in either the browser or server
// got this from underscore: http://documentcloud.github.com/underscore/
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = t;
    }
    exports.t = t;
} else if (typeof define === 'function' && define.amd) {
    // Register as a named module with AMD.
    define('t', function() {
        return t;
    });
} else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['t'] = t;
}


// perform a depth-first search, executing the given callback at each node.
//
//  t.dfs(node, [config object], function(node, par, ret, ctrl) { /* ... */ })
//      --> first arg is the 'Node' object where the search will start,
//          optional second arg is an optional configuration object, final arg
//          is the callback to be executed at each node
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

var isArray = function(o) {
    return toString.call(o) == '[object Array]';
};

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
            if (n === last(curParent.n.children))
                parentStack.pop();
            return;
        }

        if (! par) {
            if (isArray(node))
                ret.push(newNode);
            else
                ret = newNode;

        } else {
            curParent.ret.children.push(newNode);

            if (n === last(curParent.n.children))
                parentStack.pop();
        }

        if (n.children && n.children.length) {
            newNode.children = [];
            parentStack.push({n: n, ret: newNode});
        }
    });

    return ret;
};

t.filter = function(node, nodeFactory) {
    return t.map(node, {filter: true}, nodeFactory);
};

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


}())
