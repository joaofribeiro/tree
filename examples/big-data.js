webpackJsonp([3],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(295);


/***/ }),

/***/ 260:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generateData = generateData;
	exports.calcTotal = calcTotal;
	exports.isInclude = isInclude;
	exports.filterParentPosition = filterParentPosition;
	exports.getFilterExpandedKeys = getFilterExpandedKeys;
	exports.getRadioSelectKeys = getRadioSelectKeys;
	/* eslint no-loop-func: 0*/
	
	function generateData() {
	  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
	  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	  var gData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	
	  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
	  function _loop(_level, _preKey, _tns) {
	    var preKey = _preKey || '0';
	    var tns = _tns || gData;
	
	    var children = [];
	    for (var i = 0; i < x; i++) {
	      var key = preKey + '-' + i;
	      tns.push({ title: key + '-label', key: key + '-key' });
	      if (i < y) {
	        children.push(key);
	      }
	    }
	    if (_level < 0) {
	      return tns;
	    }
	    var __level = _level - 1;
	    children.forEach(function (key, index) {
	      tns[index].children = [];
	      return _loop(__level, key, tns[index].children);
	    });
	  }
	  _loop(z);
	  return gData;
	}
	function calcTotal() {
	  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
	  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	
	  /* eslint no-param-reassign:0*/
	  var rec = function rec(n) {
	    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
	  };
	  return rec(z + 1);
	}
	console.log('总节点数（单个tree）：', calcTotal());
	// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。
	
	var gData = exports.gData = generateData();
	
	function isInclude(smallArray, bigArray) {
	  return smallArray.every(function (ii, i) {
	    return ii === bigArray[i];
	  });
	}
	// console.log(isInclude(['0', '1'], ['0', '10', '1']));
	
	
	// arr.length === 628, use time: ~20ms
	function filterParentPosition(arr) {
	  var levelObj = {};
	  arr.forEach(function (item) {
	    var posLen = item.split('-').length;
	    if (!levelObj[posLen]) {
	      levelObj[posLen] = [];
	    }
	    levelObj[posLen].push(item);
	  });
	  var levelArr = Object.keys(levelObj).sort();
	
	  var _loop2 = function _loop2(i) {
	    if (levelArr[i + 1]) {
	      levelObj[levelArr[i]].forEach(function (ii) {
	        var _loop3 = function _loop3(j) {
	          levelObj[levelArr[j]].forEach(function (_i, index) {
	            if (isInclude(ii.split('-'), _i.split('-'))) {
	              levelObj[levelArr[j]][index] = null;
	            }
	          });
	          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(function (p) {
	            return p;
	          });
	        };
	
	        for (var j = i + 1; j < levelArr.length; j++) {
	          _loop3(j);
	        }
	      });
	    }
	  };
	
	  for (var i = 0; i < levelArr.length; i++) {
	    _loop2(i);
	  }
	  var nArr = [];
	  levelArr.forEach(function (i) {
	    nArr = nArr.concat(levelObj[i]);
	  });
	  return nArr;
	}
	// console.log(filterParentPosition(
	//   ['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']
	// ));
	
	
	function loopData(data, callback) {
	  var loop = function loop(d) {
	    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	    d.forEach(function (item, index) {
	      var pos = level + '-' + index;
	      if (item.children) {
	        loop(item.children, pos);
	      }
	      callback(item, index, pos);
	    });
	  };
	  loop(data);
	}
	
	function spl(str) {
	  return str.split('-');
	}
	function splitLen(str) {
	  return str.split('-').length;
	}
	
	function getFilterExpandedKeys(data, expandedKeys) {
	  var expandedPosArr = [];
	  loopData(data, function (item, index, pos) {
	    if (expandedKeys.indexOf(item.key) > -1) {
	      expandedPosArr.push(pos);
	    }
	  });
	  var filterExpandedKeys = [];
	  loopData(data, function (item, index, pos) {
	    expandedPosArr.forEach(function (p) {
	      if ((splitLen(pos) < splitLen(p) && p.indexOf(pos) === 0 || pos === p) && filterExpandedKeys.indexOf(item.key) === -1) {
	        filterExpandedKeys.push(item.key);
	      }
	    });
	  });
	  return filterExpandedKeys;
	}
	
	function isSibling(pos, pos1) {
	  pos.pop();
	  pos1.pop();
	  return pos.join(',') === pos1.join(',');
	}
	
	function getRadioSelectKeys(data, selectedKeys, key) {
	  var res = [];
	  var pkObjArr = [];
	  var selPkObjArr = [];
	  loopData(data, function (item, index, pos) {
	    if (selectedKeys.indexOf(item.key) > -1) {
	      pkObjArr.push([pos, item.key]);
	    }
	    if (key && key === item.key) {
	      selPkObjArr.push(pos, item.key);
	    }
	  });
	  var lenObj = {};
	  var getPosKey = function getPosKey(pos, k) {
	    var posLen = splitLen(pos);
	    if (!lenObj[posLen]) {
	      lenObj[posLen] = [[pos, k]];
	    } else {
	      lenObj[posLen].forEach(function (pkArr, i) {
	        if (isSibling(spl(pkArr[0]), spl(pos))) {
	          // 后来覆盖前者
	          lenObj[posLen][i] = [pos, k];
	        } else if (spl(pkArr[0]) !== spl(pos)) {
	          lenObj[posLen].push([pos, k]);
	        }
	      });
	    }
	  };
	  pkObjArr.forEach(function (pk) {
	    getPosKey(pk[0], pk[1]);
	  });
	  if (key) {
	    getPosKey(selPkObjArr[0], selPkObjArr[1]);
	  }
	
	  Object.keys(lenObj).forEach(function (item) {
	    lenObj[item].forEach(function (i) {
	      if (res.indexOf(i[1]) === -1) {
	        res.push(i[1]);
	      }
	    });
	  });
	  return res;
	}

/***/ }),

/***/ 295:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"rc-tree/assets/index.less\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(39);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTree = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"rc-tree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _bigDataGenerator = __webpack_require__(296);
	
	var _bigDataGenerator2 = _interopRequireDefault(_bigDataGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    multiple: _react.PropTypes.bool
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {};
	  },
	  getInitialState: function getInitialState() {
	    return {
	      gData: [],
	      expandedKeys: [],
	      checkedKeys: [],
	      checkedKeys1: [],
	      selectedKeys: []
	    };
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    // invoked immediately before rendering with new props or state, not for initial 'render'
	    // see componentWillReceiveProps if you need to call setState
	    // console.log(nextState.gData === this.state.gData);
	    if (nextState.gData === this.state.gData) {
	      this.notReRender = true;
	    } else {
	      this.notReRender = false;
	    }
	  },
	  onCheck: function onCheck(checkedKeys) {
	    this.setState({
	      checkedKeys: checkedKeys
	    });
	  },
	  onCheckStrictly: function onCheckStrictly(checkedKeys1) /* extra*/{
	    console.log(arguments);
	    this.setState({
	      checkedKeys1: checkedKeys1
	    });
	  },
	  onSelect: function onSelect(selectedKeys, info) {
	    console.log('onSelect', selectedKeys, info);
	    this.setState({
	      selectedKeys: selectedKeys
	    });
	  },
	  onGen: function onGen(data) {
	    this.setState({
	      gData: data,
	      expandedKeys: ['0-0-0-key'],
	      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
	      checkedKeys: ['0-0-0-key'],
	      checkedKeys1: ['0-0-0-key'],
	      selectedKeys: []
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2.default.createElement(
	            _rcTree.TreeNode,
	            { key: item.key, title: item.title },
	            loop(item.children)
	          );
	        }
	        return _react2.default.createElement(_rcTree.TreeNode, { key: item.key, title: item.title });
	      });
	    };
	    // const s = Date.now();
	    // const treeNodes = loop(this.state.gData);
	    var treeNodes = void 0;
	    if (this.treeNodes && this.notReRender) {
	      treeNodes = this.treeNodes;
	    } else {
	      treeNodes = loop(this.state.gData);
	      this.treeNodes = treeNodes;
	    }
	    // console.log(Date.now()-s);
	    return _react2.default.createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2.default.createElement(_bigDataGenerator2.default, { onGen: this.onGen }),
	      _react2.default.createElement(
	        'div',
	        { style: { border: '1px solid red', width: 700, padding: 10 } },
	        _react2.default.createElement(
	          'h5',
	          { style: { margin: 10 } },
	          '\u5927\u6570\u636E\u91CF\u4E0B\u4F18\u5316\u5EFA\u8BAE\uFF1A'
	        ),
	        '\u521D\u59CB\u5C55\u5F00\u7684\u8282\u70B9\u5C11\uFF0C\u5411dom\u4E2D\u63D2\u5165\u8282\u70B9\u5C31\u4F1A\u5C11\uFF0C\u901F\u5EA6\u66F4\u5FEB\u3002 ',
	        _react2.default.createElement('br', null),
	        'treeNodes \u603B\u6570\u636E\u91CF\u5C3D\u91CF\u5C11\u53D8\u5316\uFF0C\u7F13\u5B58\u5E76\u590D\u7528\u8BA1\u7B97\u51FA\u7684 treeNodes\uFF0C\u53EF\u5728 componentWillUpdate \u7B49\u65F6\u673A\u505A\u5224\u65AD\u3002 ',
	        _react2.default.createElement('br', null)
	      ),
	      this.state.gData.length ? _react2.default.createElement(
	        'div',
	        { style: { display: 'flex' } },
	        _react2.default.createElement(
	          'div',
	          { style: { marginRight: 20 } },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'normal check'
	          ),
	          _react2.default.createElement(
	            _rcTree2.default,
	            {
	              checkable: true, multiple: this.props.multiple,
	              defaultExpandedKeys: this.state.expandedKeys,
	              onCheck: this.onCheck, checkedKeys: this.state.checkedKeys,
	              onSelect: this.onSelect, selectedKeys: this.state.selectedKeys
	            },
	            treeNodes
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h3',
	            null,
	            'checkStrictly'
	          ),
	          _react2.default.createElement(
	            _rcTree2.default,
	            {
	              checkable: true, checkStrictly: true, multiple: this.props.multiple,
	              defaultExpandedKeys: this.state.expandedKeys,
	              onCheck: this.onCheckStrictly, checkedKeys: this.state.checkedKeys1,
	              onSelect: this.onSelect, selectedKeys: this.state.selectedKeys
	            },
	            treeNodes
	          )
	        )
	      ) : null
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _util = __webpack_require__(260);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Gen = _react2.default.createClass({
	  displayName: 'Gen',
	
	  propTypes: {
	    onGen: _react.PropTypes.func,
	    x: _react.PropTypes.number,
	    y: _react.PropTypes.number,
	    z: _react.PropTypes.number
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onGen: function onGen() {},
	      x: 20,
	      y: 18,
	      z: 1
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      nums: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	  },
	  onGen: function onGen(e) {
	    e.preventDefault();
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	    this.setState({
	      nums: (0, _util.calcTotal)(vals.x, vals.y, vals.z)
	    });
	  },
	  getVals: function getVals() {
	    return {
	      x: parseInt(this.refs.x.value, 10),
	      y: parseInt(this.refs.y.value, 10),
	      z: parseInt(this.refs.z.value, 10)
	    };
	  },
	  render: function render() {
	    var _props = this.props,
	        x = _props.x,
	        y = _props.y,
	        z = _props.z;
	
	    return _react2.default.createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2.default.createElement(
	        'h2',
	        null,
	        'big data generator'
	      ),
	      _react2.default.createElement(
	        'form',
	        { onSubmit: this.onGen },
	        _react2.default.createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'x: ',
	          _react2.default.createElement('input', { ref: 'x', defaultValue: x, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2.default.createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'y: ',
	          _react2.default.createElement('input', { ref: 'y', defaultValue: y, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2.default.createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'z: ',
	          _react2.default.createElement('input', { ref: 'z', defaultValue: z, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2.default.createElement(
	          'button',
	          { type: 'submit' },
	          'Generate'
	        ),
	        _react2.default.createElement(
	          'p',
	          null,
	          'total nodes: ',
	          this.state.nums || (0, _util.calcTotal)(x, y, z)
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        { style: { fontSize: 12 } },
	        'x\uFF1A\u6BCF\u4E00\u7EA7\u4E0B\u7684\u8282\u70B9\u603B\u6570\u3002y\uFF1A\u6BCF\u7EA7\u8282\u70B9\u91CC\u6709y\u4E2A\u8282\u70B9\u3001\u5B58\u5728\u5B50\u8282\u70B9\u3002z\uFF1A\u6811\u7684level\u5C42\u7EA7\u6570\uFF080\u8868\u793A\u4E00\u7EA7\uFF09'
	      )
	    );
	  }
	});
	exports.default = Gen;
	module.exports = exports['default'];

/***/ })

});
//# sourceMappingURL=big-data.js.map