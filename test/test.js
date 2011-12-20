

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
    should = require('chai').should(),
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

                node.name.should.equal(order.dfs[cur++]);

                if (par)
                    par.name.should.equal(expected.par);
                else
                    expect(par).to.equal(expected.par);

                pluck('name', node.children||[]).should.eql(expected.children);
            });
        });

        it('sets "this" properly', function() {
            t.dfs(tree, function() {
                this.name.should.equal(order.dfs[cur++]);
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
            visitedSet.should.eql(includedSet);
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
            visitedSet.should.eql(includedSet);
        });

        it('correctly traverses list of nodes', function() {
            var tree = data[1].tree,
                dict = data[1].dict,
                order = data[1].order;

            t.dfs(tree, function(node, par) {
                var expected = dict[node.name];

                node.name.should.equal(order.dfs[cur++]);

                if (par)
                    par.name.should.equal(expected.par);
                else
                    expect(par).to.equal(expected.par);

                pluck('name', node.children||[]).should.eql(expected.children);
            });
        });
    });


    describe('map', function() {
        var makeNode = function(node, par) {
            if (par)
                par.should.include.keys('other');

            return {
                name: node.name,
                other: 'some other prop for ' + node.name,
                par: par
            };
        };

        it('correctly creates a new tree', function() {
            var tree2 = t.map(tree, makeNode);

            t.dfs(tree2, function(node, par) {
                node.other.should.equal('some other prop for ' + node.name);
                node.should.not.equal(dict[node.name]);
                if (node.par)
                    node.par.name.should.equal(par.name);
                else
                    expect(par).to.equal(undefined);
            });
        });

        it('correctly creates a new tree from an array', function() {
            var tree = data[1].tree,
                dict = data[1].dict;

            var tree2 = t.map(tree, makeNode);
            t.dfs(tree2, function(node, par) {
                node.other.should.equal('some other prop for ' + node.name);
                node.should.not.equal(dict[node.name]);
                if (node.par)
                    node.par.name.should.equal(par.name);
                else
                    expect(par).to.equal(undefined);
            });
        });
    });

    describe('filter', function() {
        var makeNode = function(node, par) {
            if (par)
                par.should.include.keys('other');

            if (node.name !== 'i' && node.name !== 'd')
                return {
                    name: node.name,
                    other: 'some other prop for ' + node.name,
                    par: par
                };
        };

        it('should correctly filter nodes that return false', function() {
            var tree2 = t.filter(tree, makeNode);
            var expected = 'a b c g h j k l m'.split(' ');
            var found = [];
            t.dfs(tree2, function() {
                found.push(this.name);
                if (this.par)
                    this.par.name.should.equal(dict[this.name].par);
                else
                    expect(dict[this.name].par).to.equal(undefined);
            });
            found.should.eql(expected);
        });
    });
});
