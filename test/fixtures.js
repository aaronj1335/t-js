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
            dfs: 'a b c d e f g h i j k l m'.split(' ')
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
            'd': {par: undefined,   children: []},

        },
        order: {
            dfs: 'a b c d'.split(' ')
        }
    },
    {
        tree: {
            name: 'a',
            children: [
                {
                    name: 'b',
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
            dfs: 'a b j k l'.split(' ')
        }
    },
];
