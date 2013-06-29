module.exports = [
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
            'a': {par: undefined,   children: ['b', 'j', 'k']},
            'b': {par: 'a',         children: ['c', 'd', 'g', 'h']},
            'c': {par: 'b',         children: []},
            'd': {par: 'b',         children: ['e', 'f']},
            'e': {par: 'd',         children: []},
            'f': {par: 'd',         children: []},
            'g': {par: 'b',         children: []},
            'h': {par: 'b',         children: ['i']},
            'i': {par: 'h',         children: []},
            'j': {par: 'a',         children: []},
            'k': {par: 'a',         children: ['l', 'm']},
            'l': {par: 'k',         children: []},
            'm': {par: 'k',         children: []}
        },
        order: {
            dfs: 'a b c d e f g h i j k l m'.split(' '),
            dfsPost: 'c e f d g i h b j l m k a'.split(' '),
            bfs: 'a b j k c d g h l m e f i'.split(' ')
        }
    },

    {
        tree: [
            {
                name: 'a',
                children: [
                    {
                        name: 'b'
                    },
                    {
                        name: 'c'
                    }
                ]
            },
            {
                name: 'd'
            }
        ],
        dict: {
            'a': {par: undefined,   children: ['b', 'c']},
            'b': {par: 'a',         children: []},
            'c': {par: 'a',         children: []},
            'd': {par: undefined,   children: []}

        },
        order: {
            dfs: 'a b c d'.split(' '),
            dfsPost: 'b c a d'.split(' '),
            bfs: 'a d b c'.split(' ')
        }
    },
    {
        tree: {
            name: 'a',
            children: [
                {
                    name: 'b'
                },
                {
                    name: 'j'
                },
                {
                    name: 'k',
                    children: [
                        {
                            name: 'l'
                        }
                    ]
                }
            ]
        },
        dict: {
            'a': {par: undefined,   children: ['b', 'j', 'k']},
            'b': {par: 'a',         children: ['c', 'd', 'g', 'h']},
            'j': {par: 'a',         children: []},
            'k': {par: 'a',         children: ['l', 'm']},
            'l': {par: 'k',         children: []}
        },
        order: {
            dfs: 'a b j k l'.split(' '),
            dfsPost: 'b j l k a'.split(' ')
        }
    },
    {
        tree: {
            name: 'a',
            custom_children_name: [
                {
                    name: 'b',
                    custom_children_name: [
                        {
                            name: 'c'
                        },
                        {
                            name: 'd',
                            do_not_take_this: [
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
                            custom_children_name: [
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
                    custom_children_name: [
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
            'a': {par: undefined,   children: ['b', 'j', 'k']},
            'b': {par: 'a',         children: ['c', 'd', 'g', 'h']},
            'c': {par: 'b',         children: []},
            'd': {par: 'b',         children: []},
            'g': {par: 'b',         children: []},
            'h': {par: 'b',         children: ['i']},
            'i': {par: 'h',         children: []},
            'j': {par: 'a',         children: []},
            'k': {par: 'a',         children: ['l', 'm']},
            'l': {par: 'k',         children: []},
            'm': {par: 'k',         children: []}
        },
        order: {
            dfs: 'a b c d g h i j k l m'.split(' '),
            dfsPost: 'c d g i h b j l m k a'.split(' '),
            bfs: 'a b j k c d g h l m i'.split(' ')
        }
    }
];
