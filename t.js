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
    define('underscore', function() {
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
    var cur, par, children, ctrl, i, callback, config,
        node =  toString.call(arguments[0]) == '[object Array]'?
                {children: arguments[0]} : arguments[0],
        nodes = [node],
        parents = [undefined];

    if (arguments.length === 3) {
        config = arguments[1];
        callback = arguments[2];
    } else {
        config = {};
        callback = arguments[1]
    }

    while (nodes.length > 0) {
        cur = nodes.pop();
        par = parents.pop();

        ctrl = {};
        callback.call(cur, cur, par, undefined, ctrl);

        if (ctrl.stop) break;

        children = cur.children? cur.children : [];

        for (i = children.length-1; i >= 0; i--) {
            nodes.push(children[i]);
            parents.push(cur);
        }
    }
};

t.map = function() {
};


}())
