

var pluck = function(key, arr) {
    var i, len, ret = [], cur = arr.length? arr[0] : undefined;

    for (i = 0, len = arr.length; cur = arr[i], i < len; cur = arr[i++])
        ret.push(cur[key]);

    return ret;
};

var print = function(t, level) {
    if (! t) return;

    if (typeof level === 'undefined')
        level = 1;

    var len = t.children && t.children.length? t.children.length : 0,
        indent = Array(level).join('    '),
        ret = indent + t.name + '\n';

    for (var i = 0; i < len; i++)
        ret += print(t.children[i], level + 1);

    return ret;
};

var t = require('t'),
    expect = require('chai').expect,
    data = require('test/fixtures');

describe('t', function(){
    var tree = data[0].tree,
        dict = data[0].dict,
        order = data[0].order,
        cur;

    describe('dfs', function() {
        beforeEach(function() {
            cur = 0;
        });

        it('correctly visit nodes', function() {
            t.dfs(tree, function(node, par) {
                var expected = dict[node.name];

                expect(node.name).to.be.equal(order.dfs[cur++]);

                if (par)
                    expect(par.name).to.be.equal(expected.par);
                else
                    expect(par).to.be.equal(expected.par);

                expect(pluck('name', node.children||[]))
                    .to.be.eql(expected.children);
            });
        });

        it('sets "this" properly', function() {
            t.dfs(tree, function() {
                expect(this.name).to.be.equal(order.dfs[cur++]);
            });
        });

        it('stops when ctrl.stop is set to true', function() {
            var stopNodeName = order.dfs[4];
            var includedSet = order.dfs.slice(0, 5);
            var visitedSet = [];
            t.dfs(tree, function(node, par, ctrl) {
                visitedSet.push(node.name);
                if (node.name === stopNodeName)
                    ctrl.stop = true;
            });
            expect(visitedSet).to.be.eql(includedSet);
        });

        it('doesn\'t visit children if ctrl.cutoff is set to true', function() {
            var cutoffNodeName = order.dfs[1];
            var includedSet = 'a b j k l m'.split(' ');
            var visitedSet = [];
            t.dfs(tree, function(node, par, ctrl) {
                visitedSet.push(node.name);
                if (node.name === cutoffNodeName)
                    ctrl.cutoff = true;
            });
            expect(visitedSet).to.be.eql(includedSet);
        });

        it('correctly traverses list of nodes', function() {
            var tree = data[1].tree,
                dict = data[1].dict,
                order = data[1].order;

            t.dfs(tree, function(node, par) {
                var expected = dict[node.name];

                expect(node.name).to.be.equal(order.dfs[cur++]);

                if (par)
                    expect(par.name).to.be.equal(expected.par);
                else
                    expect(par).to.be.equal(expected.par);

                expect(pluck('name', node.children||[]))
                    .to.be.eql(expected.children);
            });
        });
    });


    describe('map', function() {
        var makeNode = function(node, par) {
            if (par)
                expect(par).to.include.keys('other');

            return {
                name: node.name,
                other: 'some other prop for ' + node.name,
                par: par
            };
        };

        it('correctly creates a new tree', function() {
            var tree2 = t.map(tree, makeNode);

            t.dfs(tree2, function(node, par) {
                expect(node.other)
                    .to.be.equal('some other prop for ' + node.name);
                expect(node).to.not.equal(dict[node.name]);
                if (node.par)
                    expect(node.par.name).to.be.equal(par.name);
                else
                    expect(par).to.equal(undefined);
            });
        });

        it('correctly creates a new tree from an array', function() {
            var tree = data[1].tree,
                dict = data[1].dict;

            var tree2 = t.map(tree, makeNode);
            t.dfs(tree2, function(node, par) {
                expect(node.other).to.be.equal('some other prop for ' + node.name);
                expect(node).to.not.equal(dict[node.name]);
                if (node.par)
                    expect(node.par.name).to.be.equal(par.name);
                else
                    expect(par).to.equal(undefined);
            });
        });
    });

    describe('filter', function() {
        var makeNode = function(node, par) {
            if (par)
                expect(par).to.include.keys('other');

            if (node.name !== 'i' && node.name !== 'd')
                return {
                    name: node.name,
                    other: 'some other prop for ' + node.name,
                    par: par
                };
        };

        it('correctly filters nodes that return false', function() {
            var tree2 = t.filter(tree, makeNode);
            var expected = 'a b c g h j k l m'.split(' ');
            var found = [];
            t.dfs(tree2, function() {
                found.push(this.name);
                if (this.par)
                    expect(this.par.name).to.be.equal(dict[this.name].par);
                else
                    expect(dict[this.name].par).to.equal(undefined);
            });
            expect(found).to.be.eql(expected);
        });
    });

    describe('stroll', function() {
        // returns true if tree1 is a non-strict subset of tree2
        var isSubset = function(tree1, tree2) {
            var subset = true;

            t.stroll(tree1, tree2, function(node1, node2) {
                if (node1.name !== node2.name)
                    subset = false;

                var node2Children = node2.children?
                    pluck('name', node2.children) : [];

                if (node1.children)
                    node1.children.forEach(function(n, i) {
                        if (node2Children.indexOf(n.name) < 0)
                            subset = false;
                    });
            });

            return subset;
        };

        it('correctly walks through two trees', function() {
            var copy = t.map(tree, function(n) {
                return {name: n.name, other: 'this is node '+n.name};
            });

            t.stroll(tree, copy, function(first, second) {
                expect(first).to.not.equal(second);
                expect(first.name).to.equal(second.name);
                expect(second.other).to.equal('this is node '+second.name);
            });

            t.stroll(copy, tree, function(first, second) {
                expect(first).to.not.equal(second);
                expect(first.name).to.equal(second.name);
                expect(first.other).to.equal('this is node '+first.name);
            });
        });

        it('correctly walks through a subset tree', function() {
            expect(isSubset(data[2].tree, data[0].tree)).to.be.true;
        });

        it('correctly walks through a superset tree', function() {
            expect(isSubset(data[0].tree, data[2].tree)).to.be.false;
        });
    });

    describe('find', function() {
        it('finds a node that exists', function() {
            var res = t.find(tree, function() { return this.name === 'a'; });
            expect(res.name).to.equal('a');
        });

        it('returns undefined when no match found', function() {
            var res = t.find(tree, function() { return this.name === 'foo'; });
            expect(typeof res).to.equal('undefined');
        });

        it('stops traversing as soon as a match is found', function() {
            var visited = [],
                expected = 'a b c d e'.split(' '),
                res = t.find(tree, function() {
                    visited.push(this.name);
                    return this.name === 'e';
                });
            expect(res.name).to.equal('e');
            expect(visited).to.eql(expected);
        });

    });
});

