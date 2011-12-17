var data = [
    {
        tree: {
            name: 'a',
            children: [
                {
                    name: 'b',
                    children: [
                        {
                            name: 'c'
                        },
                        {
                            name: 'd',
                            children: [
                                {
                                    name: 'e'
                                },
                                {
                                    name: 'f'
                                }
                            ]
                        },
                        {
                            name: 'g'
                        },
                        {
                            name: 'h',
                            children: [
                                {
                                    name: 'i'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'j'
                },
                {
                    name: 'k',
                    children: [
                        {
                            name: 'l'
                        },
                        {
                            name: 'm'
                        }
                    ]
                }
            ]
        },
        dict: {
            'a': {par: undefined,      children: ['b', 'j', 'k']},
            'b': {par: 'a',   children: ['c', 'd', 'g', 'h']},
            'c': {par: 'b',   children: []},
            'd': {par: 'b',   children: ['e', 'f']},
            'e': {par: 'd',   children: []},
            'f': {par: 'd',   children: []},
            'g': {par: 'b',   children: []},
            'h': {par: 'b',   children: ['i']},
            'i': {par: 'h',   children: []},
            'j': {par: 'a',   children: []},
            'k': {par: 'a',   children: ['l', 'm']},
            'l': {par: 'k',   children: []},
            'm': {par: 'k',   children: []}
        },
        order: {
            dfs: 'a b c d e f g h i j k l m'.split(' ')
        }
    }
];

var pluck = function(key, arr) {
    var i, len, ret = [], cur = arr.length? arr[0] : undefined;

    for (i = 0, len = arr.length; cur = arr[i], i < len; cur = arr[i++])
        ret.push(cur[key]);

    return ret;
};

var t = require('t'),
    should = require('chai').should(),
    expect = require('chai').expect;

describe('t', function(){
    describe('dfs', function(){
        var tree = data[0].tree,
            dict = data[0].dict,
            order = data[0].order,
            cur;

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
            t.dfs(tree, function(node, par, ret, ctrl) {
                visitedSet.push(node.name);
                if (node.name === stopNodeName)
                    ctrl.stop = true;
            });
            visitedSet.should.eql(includedSet);
        });

    });
});

