'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChildrenUtils = require('./ChildrenUtils');

var _ChildrenUtils2 = _interopRequireDefault(_ChildrenUtils);

var _AnimateChild = require('./AnimateChild');

var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

var defaultKey = 'rc_animate_' + Date.now();

function getChildrenFromProps(props) {
  var children = props.children;
  if (_react2['default'].isValidElement(children)) {
    if (!children.key) {
      return _react2['default'].cloneElement(children, {
        key: defaultKey
      });
    }
  }
  return children;
}

var Animate = _react2['default'].createClass({
  displayName: 'Animate',

  protoTypes: {
    component: _react2['default'].PropTypes.any,
    animation: _react2['default'].PropTypes.object,
    transitionName: _react2['default'].PropTypes.string,
    transitionEnter: _react2['default'].PropTypes.bool,
    transitionLeave: _react2['default'].PropTypes.bool,
    onEnd: _react2['default'].PropTypes.func,
    showProp: _react2['default'].PropTypes.bool,
    animateMount: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animation: {},
      component: 'span',
      transitionEnter: true,
      transitionLeave: true,
      enter: true,
      animateMount: false,
      onEnd: function onEnd() {}
    };
  },

  getInitialState: function getInitialState() {
    this.currentlyAnimatingKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    return {
      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props))
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this = this;

    var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
    var props = this.props;
    var showProp = props.showProp;
    var exclusive = props.exclusive;
    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    // last props children if exclusive
    // exclusive needs immediate response
    var currentChildren = this.state.children;
    var newChildren = _ChildrenUtils2['default'].mergeChildren(currentChildren, nextChildren);

    if (showProp && !exclusive) {
      newChildren = newChildren.map(function (c) {
        if (!c.props[showProp] && (0, _ChildrenUtils.isShownInChildren)(currentChildren, c, showProp)) {
          c = _react2['default'].cloneElement(c, _defineProperty({}, showProp, true));
        }
        return c;
      });
    }

    this.setState({
      children: newChildren
    });

    // exclusive needs immediate response
    if (exclusive) {
      Object.keys(currentlyAnimatingKeys).forEach(function (key) {
        _this.stop(key);
      });
      currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
    }

    nextChildren.forEach(function (c) {
      var key = c.key;
      if (currentlyAnimatingKeys[key]) {
        return;
      }
      var hasPrev = (0, _ChildrenUtils.inChildren)(currentChildren, c);
      if (showProp) {
        if (hasPrev) {
          var showInNow = (0, _ChildrenUtils.isShownInChildren)(currentChildren, c, showProp);
          var showInNext = c.props[showProp];
          if (!showInNow && showInNext) {
            _this.keysToEnter.push(key);
          }
        }
      } else if (!hasPrev) {
        _this.keysToEnter.push(key);
      }
    });

    currentChildren.forEach(function (c) {
      var key = c.key;
      if (currentlyAnimatingKeys[key]) {
        return;
      }
      var hasNext = (0, _ChildrenUtils.inChildren)(nextChildren, c);
      if (showProp) {
        if (hasNext) {
          var showInNext = (0, _ChildrenUtils.isShownInChildren)(nextChildren, c, showProp);
          var showInNow = c.props[showProp];
          if (!showInNext && showInNow) {
            _this.keysToLeave.push(key);
          }
        }
      } else if (!hasNext) {
        _this.keysToLeave.push(key);
      }
    });
  },

  performEnter: function performEnter(key) {
    // may already remove by exclusive
    if (this.refs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.refs[key].componentWillEnter(this._handleDoneEntering.bind(this, key));
    }
  },

  _handleDoneEntering: function _handleDoneEntering(key) {
    delete this.currentlyAnimatingKeys[key];
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props));
    if (!this.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      this.performLeave(key);
    } else {
      this.props.onEnd(key, true);
      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren)) {
        this.setState({
          children: currentChildren
        });
      }
    }
  },

  performLeave: function performLeave(key) {
    // may already remove by exclusive
    if (this.refs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.refs[key].componentWillLeave(this._handleDoneLeaving.bind(this, key));
    }
  },

  isValidChildByKey: function isValidChildByKey(currentChildren, key) {
    var showProp = this.props.showProp;
    if (showProp) {
      return (0, _ChildrenUtils.isShownInChildrenByKey)(currentChildren, key, showProp);
    } else {
      return (0, _ChildrenUtils.inChildrenByKey)(currentChildren, key);
    }
  },

  _handleDoneLeaving: function _handleDoneLeaving(key) {
    delete this.currentlyAnimatingKeys[key];
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props));
    // in case state change is too fast
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key);
    } else {
      this.props.onEnd(key, false);
      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren)) {
        this.setState({
          children: currentChildren
        });
      }
    }
  },

  stop: function stop(key) {
    delete this.currentlyAnimatingKeys[key];
    var component = this.refs[key];
    if (component) {
      component.stop();
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.animateMount) {
      this.state.children.map(function (c) {
        return c.key;
      }).forEach(this.performEnter);
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  },

  render: function render() {
    var props = this.props;
    var children = this.state.children.map(function (child) {
      if (!child.key) {
        throw new Error('must set key for <rc-animate> children');
      }
      return _react2['default'].createElement(
        _AnimateChild2['default'],
        {
          key: child.key,
          ref: child.key,
          animation: props.animation,
          transitionName: props.transitionName,
          transitionEnter: props.transitionEnter,
          transitionLeave: props.transitionLeave },
        child
      );
    });
    var Component = props.component;
    if (Component) {
      return _react2['default'].createElement(
        Component,
        this.props,
        children
      );
    } else {
      return children[0] || null;
    }
  }
});

exports['default'] = Animate;
module.exports = exports['default'];