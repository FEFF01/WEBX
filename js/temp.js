
var _webx = window._webx, 
_webx_t,
_webx_set_attribute = _webx.setAttribute, 
_webx_add_event_listener = _webx.addEventListener,
_webx_set_nodes = _webx.setNodes,
_webx_next_nodes = _webx.nextNodes,
_webx_create_element = _webx.createElement, 
_webx_create_text_node = _webx.createTextNode, 

_webx_run_in_action = _webx.runInAction,
_webx_autorun = _webx.autorun,
_webx_action = _webx.action,
_webx_prevent_collect = _webx.prevent,
_webx_observable = _webx.observable,
_webx_next_child = _webx.nextChild,
_webx_next_sibling = _webx.nextSibling,
_webx_next_if_sibling = _webx.nextIfSibling,
_webx_next_entry_sibling = _webx.nextEntrySibling,
_webx_remove_all_sibling = _webx.removeAllSibling,

_webx_entry_statement = _webx.entryStatement;
let _webx$0 = _webx_observable({});
_webx$0.A = [
    [
        'chrome',
        {
            'version_added': '49',
            'release_date': '2016-03-02'
        }
    ],
    [true],
    [
        'chrome_android',
        {
            'version_added': '49',
            'release_date': '2016-03-09'
        }
    ],
    [
        'edge',
        {
            'version_added': '12',
            'release_date': '2015-07-28'
        }
    ],
    [
        'firefox',
        {
            'version_added': '18',
            'release_date': '2013-01-08'
        }
    ],
    [
        'firefox_android',
        {
            'version_added': '18',
            'release_date': '2013-01-08'
        }
    ],
    [
        'ie',
        { 'version_added': false }
    ],
    [
        'nodejs',
        {
            'version_added': '6.0.0',
            'release_date': '2016-04-26'
        }
    ],
    [
        'opera',
        {
            'version_added': '36',
            'release_date': '2016-03-15'
        }
    ],
    [
        'opera_android',
        {
            'version_added': '36',
            'release_date': '2016-03-31'
        }
    ],
    [
        'safari',
        {
            'version_added': '10',
            'release_date': '2016-09-20'
        }
    ],
    [
        'safari_ios',
        {
            'version_added': '10',
            'release_date': '2016-09-13'
        }
    ],
    [
        'samsunginternet_android',
        {
            'version_added': '5.0',
            'release_date': '2016-12-15'
        }
    ],
    [
        'webview_android',
        {
            'version_added': '49',
            'release_date': '2016-03-09'
        }
    ]
];
_webx$0.B = '#333';
document.body.appendChild(_webx_autorun(function () {
    var _webx_el = _webx_create_element('div');
    _webx_next_child(_webx_el, '\n        ');;
    _webx_next_child(_webx_el, _webx_autorun(function () {
        var _webx_el = _webx_create_element('button');
        _webx_next_child(_webx_el, 'update color');;
        _webx_set_attribute(_webx_el, 'onclick', function updateColor() {
            _webx$0.B = '#' + Math.random().toString(16).slice(2, 8);
        }, 1);
        return _webx_el;
    }, 1));;
    _webx_next_child(_webx_el, '\n        ');;
    {
        let _webx_t_sibling0 = _webx_next_child(_webx_el);;
        _webx_autorun(function () {
            _webx_remove_all_sibling(_webx_t_sibling0);
            _webx_next_nodes(_webx_t_sibling0, _webx_create_element('br'));
            _webx_next_nodes(_webx_t_sibling0, _webx_create_element('br'));
            _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                var _webx_el = _webx_create_element('input');
                _webx_set_attribute(_webx_el, 'style', 'margin-left: 10px;');
                _webx_autorun(function () {
                    _webx_set_attribute(_webx_el, 'value', name, 1);
                });
                _webx_add_event_listener(_webx_el, 'input', function () {
                    name = _webx_el.value;
                });
                _webx_set_attribute(_webx_el, 'placeholder', 'name');
                return _webx_el;
            }, 1));
            _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                var _webx_el = _webx_create_element('button');
                _webx_next_child(_webx_el, 'add item');;
                _webx_set_attribute(_webx_el, 'onclick', function () {
                    _webx$0.A.unshift([
                        name,
                        {}
                    ]);
                    name = '';
                }, 1);
                return _webx_el;
            }, 1));
        });
    }
    _webx_next_child(_webx_el, '\n        ');;
    _webx_next_child(_webx_el, _webx_autorun(function () {
        var _webx_el = _webx_create_element('ul');
        _webx_next_child(_webx_el, '\n            ');;
        {
            let _webx_t_sibling0 = _webx_next_child(_webx_el);;
            {
                let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling0);
                _webx_next_entry_sibling(_webx_t_sibling2, function () {
                    return _webx$0.A;
                }, function (_webx$_D1_entry) {
                    let _webx$_TB = _webx$0.A[_webx$_D1_entry.k];
                    {
                        let _webx_t_sibling3 = _webx_next_sibling(_webx_t_sibling2);
                        _webx_next_nodes(_webx_t_sibling3, _webx_autorun(function () {
                            var _webx$_props = _webx_observable({ children: [] });
                            var _webx_el = _webx$_props.children;
                            _webx_autorun(function () {
                                _webx$_props.index = _webx$_D1_entry.k;
                            });
                            _webx_next_child(_webx_el, '\n                    ');;
                            console.log(0.9999999999);
                            _webx_next_child(_webx_el, function () {
                                if(window.test===true){
                                    debugger;
                                }
                                console.log(11111,_webx$_TB[0]);
                                return _webx$_TB[0] === true ? _webx_autorun(function () {
                                    var _webx$_props = _webx_observable({ children: [] });
                                    var _webx_el = _webx$_props.children;
                                    return SupportTable(_webx$_props);
                                }, 1) : _webx_autorun(function () {
                                    var _webx_el = _webx_create_element('div');
                                    _webx_next_child(_webx_el, '\n                        ');;
                                    _webx_next_child(_webx_el, _webx_autorun(function () {
                                        var _webx_el = _webx_create_element('button');
                                        _webx_next_child(_webx_el, 'X');;
                                        _webx_set_attribute(_webx_el, 'style', 'position:absolute;right:0;top:0;');
                                        _webx_set_attribute(_webx_el, 'onclick', () => {
                                            _webx$0.A.splice(_webx$_D1_entry.k, 1);
                                        }, 1);
                                        return _webx_el;
                                    }, 1));;
                                    _webx_next_child(_webx_el, '\n                        index : ');;
                                    _webx_next_child(_webx_el, function () {
                                        return _webx$_D1_entry.k;
                                    }, 1);;
                                    _webx_next_child(_webx_el, ',\n                        name : ');;
                                    _webx_next_child(_webx_el, function () {
                                        return _webx$_TB[0];
                                    }, 1);;
                                    _webx_next_child(_webx_el, '\n                        ');;
                                    _webx_next_child(_webx_el, _webx_create_element('br'));;
                                    _webx_next_child(_webx_el, '\n                        data : ');;
                                    _webx_next_child(_webx_el, _webx_autorun(function () {
                                        var _webx_el = _webx_create_element('val');
                                        _webx_next_child(_webx_el, function () {
                                            return JSON.stringify(_webx$_TB[1]);
                                        }, 1);;
                                        return _webx_el;
                                    }, 1));;
                                    _webx_next_child(_webx_el, '\n                        ');;
                                    console.log(2222);
                                    _webx_next_child(_webx_el, _webx_autorun(function () {
                                        var _webx$_props = _webx_observable({ children: [] });
                                        var _webx_el = _webx$_props.children;
                                        _webx_autorun(function () {
                                            _webx$_props.data = _webx$_TB[1];
                                        });
                                        if(window.test===true){
                                            debugger;
                                        }
                                        console.log(3333);
                                        return SupportInfo(_webx$_props);
                                    }, 1));;
                                    _webx_next_child(_webx_el, '\n                    ');;
                                    return _webx_el;
                                }, 1);
                            }, 1);;
                            _webx_next_child(_webx_el, '\n                    ');;
                            {
                                let _webx_t_sibling0 = _webx_next_child(_webx_el);;
                                {
                                    let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling0);
                                    _webx_next_entry_sibling(_webx_t_sibling2, function () {
                                        return _webx$_TB[1];
                                    }, function (_webx$_D1_entry) {
                                        _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                                            var _webx_el = _webx_create_element('span');
                                            _webx_next_child(_webx_el, function () {
                                                return _webx$_D1_entry.v;
                                            }, 1);;
                                            return _webx_el;
                                        }, 1));
                                    });
                                }
                            }
                            _webx_next_child(_webx_el, '\n                ');;
                            return Draggable(_webx$_props);
                        }, 1));
                    }
                });
            }
        }
        _webx_next_child(_webx_el, '\n        ');;
        _webx_set_attribute(_webx_el, 'class', 'support-list');
        return _webx_el;
    }, 1));;
    _webx_next_child(_webx_el, '\n        ');;
    _webx_next_child(_webx_el, _webx_autorun(function () {
        var _webx_el = _webx_create_element('ul');
        _webx_next_child(_webx_el, '\n            ');;
        {
            let _webx$3 = _webx_observable({});
            let _webx_t_sibling0 = _webx_next_child(_webx_el);;
            _webx$3.A = [
                'a',
                'b',
                'c'
            ];
            {
                let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling0);
                _webx_next_entry_sibling(_webx_t_sibling2, function () {
                    return _webx$3.A;
                }, function (_webx$_D1_entry) {
                    _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                        var _webx_el = _webx_create_element('li');
                        _webx_next_child(_webx_el, ' ');;
                        _webx_next_child(_webx_el, function () {
                            return _webx$_D1_entry.k + ':' + _webx$3.A[_webx$_D1_entry.k];
                        }, 1);;
                        _webx_next_child(_webx_el, ' ');;
                        _webx_next_child(_webx_el, _webx_autorun(function () {
                            var _webx_el = _webx_create_element('input');
                            _webx_autorun(function () {
                                _webx_set_attribute(_webx_el, 'value', _webx$3.A[_webx$_D1_entry.k], 1);
                            });
                            _webx_add_event_listener(_webx_el, 'input', function () {
                                _webx$3.A[_webx$_D1_entry.k] = _webx_el.value;
                            });
                            return _webx_el;
                        }, 1));;
                        return _webx_el;
                    }, 1));
                });
            }
            console.log(_webx$3.A);
        }
        _webx_next_child(_webx_el, '\n        ');;
        return _webx_el;
    }, 1));;
    _webx_next_child(_webx_el, '\n    ');;
    return _webx_el;
}, 1));
function Draggable(_webx$_D0_P0) {
    let _webx$1 = _webx_observable({});
    _webx$1.A = false;
    _webx$1.B = 0;
    _webx$1.C = 0;
    _webx$1.D = true;
    _webx$1.E = _webx_autorun(function () {
        var _webx_el = _webx_create_element('li');
        _webx_next_child(_webx_el, '\n            ');;
        _webx_next_child(_webx_el, function () {
            return _webx$_D0_P0.children;
        }, 1);;
        _webx_next_child(_webx_el, '\n        ');;
        _webx_autorun(function () {
            _webx_set_attribute(_webx_el, 'class', _webx$1.A ? 'dragging' : '');
        });
        _webx_autorun(function () {
            _webx_set_attribute(_webx_el, 'style', `
                transform: translate(${ _webx$1.B }px, ${ _webx$1.C }px);
                ${ _webx$1.D && !_webx$1.A ? 'transition:all 0.3s;' : '' }
            `);
        });
        return _webx_el;
    }, 1);
    _webx_autorun(function () {
        clearTimeout(_webx$1.H);
        if (_webx$1.F !== _webx$_D0_P0.index) {
            if (_webx$1.A || _webx$1.F === undefined) {
                _webx$1.H = setTimeout(function () {
                    _webx$1.G = _webx$1.E.getBoundingClientRect().y + window.scrollY;
                });
            } else {
                let _webx$4 = _webx_observable({});
                _webx$1.D = false;
                _webx$1.C = 0;
                _webx_autorun(function () {
                    _webx$4.A = _webx$1.E.getBoundingClientRect().y + window.scrollY;
                });
                _webx$1.C = _webx$1.G - _webx$4.A;
                _webx$1.H = setTimeout(_webx_action(function enter_to() {
                    _webx$1.D = true;
                    _webx$1.C = 0;
                }), 6);
                _webx$1.G = _webx$4.A;
            }
            _webx$1.F = _webx$_D0_P0.index;
        }
    });
    new InputListener(_webx$1.E, {
        dragStart(e) {
            let tag_name = e.target.tagName;
            if (tag_name === 'INPUT' || tag_name === 'BUTTON') {
                return true;
            }
            e.preventDefault();
        },
        dragMove: _webx_action(function move(_webx$_D1_P0, _webx$_D1_P1) {
            var e = _webx$_D1_P0;
            var y = _webx$_D1_P1[1];
            var x = _webx$_D1_P1[0];
            if (_webx$1.A || x * x + y * y > 20) {
                _webx$1.B += x;
                _webx$1.C += y;
                _webx$1.A = true;
                let prevsib = _webx$1.E.previousElementSibling;
                let nextsib = _webx$1.E.nextElementSibling;
                if (_webx$_D0_P0.index < _webx$0.A.length - 1 && _webx$1.C > nextsib.offsetHeight / 2) {
                    let _index = Number(_webx$_D0_P0.index);
                    _webx$0.A.splice(_index, 0, _webx$0.A.splice(_index + 1, 1)[0]);
                    _webx$1.C -= nextsib.offsetHeight;
                } else {
                    if (_webx$_D0_P0.index > 0 && _webx$1.C < -prevsib.offsetHeight / 2) {
                        let _index = Number(_webx$_D0_P0.index);
                        _webx$0.A.splice(_index, 0, _webx$0.A.splice(_index - 1, 1)[0]);
                        _webx$1.C += prevsib.offsetHeight;
                    }
                }
            } else {
                return true;
            }
        }),
        dragEnd: function (e) {
            _webx$1.A = false;
            _webx$1.B = _webx$1.C = 0;
        }
    });
    return _webx$1.E;
}
function SupportTable() {
    let _webx$1 = _webx_observable({});
    _webx_autorun(function () {
        if (!_webx$1.A || (_webx$1.B = _webx$0.A.indexOf(_webx$1.A)) < 0) {
            _webx$1.A = _webx$0.A[0];
            _webx$1.B = 0;
        }
    });
    return _webx_autorun(function () {
        var _webx_el = _webx_create_element('li');
        _webx_next_child(_webx_el, '\n        ');;
        {
            let _webx_t_sibling0 = _webx_next_child(_webx_el);;
            _webx_autorun(function () {
                _webx_remove_all_sibling(_webx_t_sibling0);
                _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                    var _webx_el = _webx_create_element('aside');
                    _webx_next_child(_webx_el, '\n            ');;
                    {
                        let _webx_t_sibling0 = _webx_next_child(_webx_el);;
                        {
                            let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling0);
                            _webx_next_entry_sibling(_webx_t_sibling2, function () {
                                return slice(_webx$0.A, 6);
                            }, function (_webx$_D1_entry) {
                                _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                                    var _webx_el = _webx_create_element('button');
                                    _webx_next_child(_webx_el, '\n                        ');;
                                    _webx_next_child(_webx_el, function () {
                                        return _webx$_D1_entry.v[0];
                                    }, 1);;
                                    _webx_next_child(_webx_el, '\n                    ');;
                                    _webx_autorun(function () {
                                        _webx_set_attribute(_webx_el, 'class', _webx$1.A === _webx$_D1_entry.v ? 'activate' : '');
                                    });
                                    _webx_set_attribute(_webx_el, 'onclick', function () {
                                        _webx$1.A = _webx$_D1_entry.v;
                                    }, 1);
                                    return _webx_el;
                                }, 1));
                            });
                        }
                    }
                    _webx_next_child(_webx_el, '\n        ');;
                    return _webx_el;
                }, 1));
                _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                    var _webx_el = _webx_create_element('main');
                    _webx_next_child(_webx_el, '\n            ');;
                    {
                        let _webx_t_sibling0 = _webx_next_child(_webx_el);;
                        _webx_autorun(function () {
                            let _webx$7 = _webx_observable({});
                            _webx_remove_all_sibling(_webx_t_sibling0);
                            _webx_autorun(function () {
                                _webx$7.A = _webx$1.A[0];
                            });
                            _webx_autorun(function () {
                                _webx$7.B = _webx$1.A[1];
                            });
                            _webx_next_nodes(_webx_t_sibling0, _webx_create_element('br'));
                            {
                                let _webx_t_sibling1 = _webx_next_sibling(_webx_t_sibling0);
                                _webx_autorun(function () {
                                    _webx_set_nodes(_webx_t_sibling1, _webx$1.B + ' - ' + _webx$7.A + ':');
                                });
                            }
                            _webx_next_nodes(_webx_t_sibling0, _webx_create_element('br'));
                            {
                                let _webx_t_sibling1 = _webx_next_sibling(_webx_t_sibling0);
                                _webx_next_if_sibling(_webx_t_sibling1, function () {
                                    return _webx$7.B;
                                }, function () {
                                    let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling1);
                                    _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                                        var _webx$_props = _webx_observable({ children: [] });
                                        var _webx_el = _webx$_props.children;
                                        _webx_autorun(function () {
                                            _webx$_props.data = _webx$7.B;
                                        });
                                        return SupportInfo(_webx$_props);
                                    }, 1));
                                }, function () {
                                    let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling1);
                                    _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                                        var _webx_el = _webx_create_element('div');
                                        _webx_next_child(_webx_el, '333333333333333333333');;
                                        return _webx_el;
                                    }, 1));
                                });
                            }
                        });
                    }
                    _webx_next_child(_webx_el, '\n        ');;
                    return _webx_el;
                }, 1));
            });
        }
        _webx_next_child(_webx_el, '\n    ');;
        _webx_set_attribute(_webx_el, 'class', 'support-table');
        return _webx_el;
    }, 1);
    function slice(_webx$_D1_P0, _webx$_D1_P1) {
        var target = _webx$_D1_P0;
        var max = (_webx_t = _webx$_D1_P1, _webx_t !== undefined ? _webx_t : 6);
        let list = [];
        for (let item of target) {
            if (item[0] !== true) {
                list.push(item);
                if (list.length >= max) {
                    break;
                }
            }
        }
        return list;
    }
}
function SupportInfo(_webx$_D0_P0) {
    return _webx_autorun(function () {
        var _webx_el = _webx_create_element('div');
        _webx_next_child(_webx_el, '\n        ');;
        {
            let _webx_t_sibling0 = _webx_next_child(_webx_el);;
            {
                let _webx_t_sibling1 = _webx_next_sibling(_webx_t_sibling0);
                _webx_next_entry_sibling(_webx_t_sibling1, function () {
                    return _webx$_D0_P0.data;
                }, function (_webx$_D1_entry) {
                    let _webx_t_sibling2 = _webx_next_sibling(_webx_t_sibling1);
                    _webx_next_nodes(_webx_t_sibling2, _webx_autorun(function () {
                        var _webx_el = _webx_create_element('label');
                        _webx_next_child(_webx_el, '\n                ');;
                        _webx_next_child(_webx_el, _webx_autorun(function () {
                            var _webx_el = _webx_create_element('span');
                            _webx_next_child(_webx_el, _webx$_D1_entry.k);;
                            return _webx_el;
                        }, 1));;
                        _webx_next_child(_webx_el, ' :\n                ');;
                        _webx_next_child(_webx_el, _webx_autorun(function () {
                            var _webx_el = _webx_create_element('input');
                            _webx_autorun(function () {
                                _webx_set_attribute(_webx_el, 'value', _webx$_D0_P0.data[_webx$_D1_entry.k], 1);
                            });
                            _webx_add_event_listener(_webx_el, 'input', function () {
                                _webx$_D0_P0.data[_webx$_D1_entry.k] = _webx_el.value;
                            });
                            _webx_set_attribute(_webx_el, 'placeholder', 'value');
                            return _webx_el;
                        }, 1));;
                        _webx_next_child(_webx_el, '\n                ');;
                        _webx_next_child(_webx_el, _webx_autorun(function () {
                            var _webx_el = _webx_create_element('button');
                            _webx_next_child(_webx_el, 'X');;
                            _webx_set_attribute(_webx_el, 'onclick', function () {
                                delete _webx$_D0_P0.data[_webx$_D1_entry.k];
                            }, 1);
                            return _webx_el;
                        }, 1));;
                        _webx_next_child(_webx_el, '\n            ');;
                        return _webx_el;
                    }, 1));
                    _webx_next_nodes(_webx_t_sibling2, _webx_create_element('br'));
                });
            }
        }
        _webx_next_child(_webx_el, '\n        ');;
        {
            let _webx_t_sibling0 = _webx_next_child(_webx_el);;
            _webx_autorun(function () {
                let _webx$4 = _webx_observable({});
                _webx_remove_all_sibling(_webx_t_sibling0);
                _webx$4.A = '';
                _webx$4.B = '';
                _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                    var _webx_el = _webx_create_element('input');
                    _webx_autorun(function () {
                        _webx_set_attribute(_webx_el, 'value', _webx$4.A, 1);
                    });
                    _webx_add_event_listener(_webx_el, 'input', function () {
                        _webx$4.A = _webx_el.value;
                    });
                    _webx_set_attribute(_webx_el, 'style', 'margin-top:6px;');
                    _webx_set_attribute(_webx_el, 'placeholder', 'key');
                    return _webx_el;
                }, 1));
                _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                    var _webx_el = _webx_create_element('input');
                    _webx_autorun(function () {
                        _webx_set_attribute(_webx_el, 'value', _webx$4.B, 1);
                    });
                    _webx_add_event_listener(_webx_el, 'input', function () {
                        _webx$4.B = _webx_el.value;
                    });
                    _webx_set_attribute(_webx_el, 'placeholder', 'value');
                    return _webx_el;
                }, 1));
                _webx_next_nodes(_webx_t_sibling0, _webx_autorun(function () {
                    var _webx_el = _webx_create_element('button');
                    _webx_next_child(_webx_el, 'add record');;
                    _webx_set_attribute(_webx_el, 'onclick', function () {
                        _webx$_D0_P0.data[_webx$4.A] || (_webx$_D0_P0.data[_webx$4.A] = '');
                        _webx$4.A = '';
                        _webx$4.B = '';
                    }, 1);
                    return _webx_el;
                }, 1));
            });
        }
        _webx_next_child(_webx_el, '\n    ');;
        _webx_set_attribute(_webx_el, 'style', 'margin-top:10px;');
        return _webx_el;
    }, 1);
}
document.head.appendChild(_webx_autorun(function () {
    var _webx_el = _webx_create_element('style');
    _webx_next_child(_webx_el, '\nbutton{\ncolor:');;
    _webx_next_child(_webx_el, function () {
        return _webx$0.B;
    }, 1);;
    _webx_next_child(_webx_el, ';\n}');;
    _webx_next_child(_webx_el, '\nbody{\npadding-bottom: 4rem;\ncolor:');;
    _webx_next_child(_webx_el, _webx$0.B);;
    _webx_next_child(_webx_el, ';\nbox-shadow: 0 0 2px ');;
    _webx_next_child(_webx_el, function () {
        return _webx$0.B;
    }, 1);;
    _webx_next_child(_webx_el, ' inset;\noverflow-x:hidden;\n}');;
    _webx_next_child(_webx_el, '\n.support-list{\npadding:10px 4px;\n}');;
    _webx_next_child(_webx_el, '\n.support-list>*{\nposition:relative;\ndisplay:block;\ncursor:pointer;\nbox-shadow:0 0 2px #999;\npadding:6px 30px 20px 6px;\nbackground-color:white;\n}');;
    _webx_next_child(_webx_el, '\n.support-list .dragging{\nz-index:100;\ncursor:move;\n}');;
    _webx_next_child(_webx_el, '\n.support-table{\ndisplay:flex;\nborder-bottom:2px solid #999;\npadding-bottom:4px;\n}');;
    _webx_next_child(_webx_el, '\n.support-table>main *{\nmargin-top:4px;\n}');;
    _webx_next_child(_webx_el, '\n.support-table>aside{\noverflow:hidden;\noverflow-y:auto;\nborder-right:2px solid #aaa;\nmargin-right:10px;\npadding: 0 6px 0 0;\n}');;
    _webx_next_child(_webx_el, '\n.support-table>aside .activate{\ncolor:white;\nbackground-color:#ccc;\n}');;
    _webx_next_child(_webx_el, '\n.support-table>aside>*{\ncursor:pointer;\ndisplay:block;\nwidth:100%;\nborder:none;\nbox-shadow:0 1px 1px #aaa;\nline-height:2rem;\nheight:2rem;\nmargin:2px;\noverflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;\n}');;
    return _webx_el;
}, 1));
_webx_entry_statement(_webx$0.A, function (value, key, index, target) {
});
window.onclick = function (e) {
    if (!e.target.className) {
        e.target.className = Math.random().toString(36).slice(2, 6);
    }
};
document.body.appendChild(_webx_autorun(function () {
    var _webx_el = _webx_create_element('div');
    _webx_next_child(_webx_el, '\n');;
    {
        let _webx$2 = _webx_observable({});
        let _webx_t_sibling0 = _webx_next_child(_webx_el);;
        _webx$2.A = '';
        {
            let _webx_t_sibling1 = _webx_next_sibling(_webx_t_sibling0);
            _webx_autorun(function () {
                _webx_remove_all_sibling(_webx_t_sibling1);
                switch (_webx$2.A) {
                case '':
                    _webx_next_nodes(_webx_t_sibling1, _webx_autorun(function () {
                        var _webx_el = _webx_create_element('div');
                        _webx_next_child(_webx_el, 'ssss');;
                        return _webx_el;
                    }, 1));
                default:
                    _webx_next_nodes(_webx_t_sibling1, _webx_autorun(function () {
                        var _webx_el = _webx_create_element('div');
                        _webx_next_child(_webx_el, 'eeee');;
                        return _webx_el;
                    }, 1));
                    break;
                }
            });
        }
    }
    _webx_next_child(_webx_el, '\n');;
    return _webx_el;
}, 1));