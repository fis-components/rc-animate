'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cssAnimation = require('css-animation');

var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

var transitionMap = {
  enter: 'transitionEnter',
  leave: 'transitionLeave'
};

var AnimateChild = _react2['default'].createClass({
  displayName: 'AnimateChild',

  transition: function transition(animationType, finishCallback) {
    var _this = this;

    var node = _react2['default'].findDOMNode(this);
    var props = this.props;
    var transitionName = props.transitionName;
    this.stop();
    var end = function end() {
      _this.stopper = null;
      finishCallback();
    };
    if ((_cssAnimation.isCssAnimationSupported || !props.animation[animationType]) && transitionName && props[transitionMap[animationType]]) {
      this.stopper = (0, _cssAnimation2['default'])(node, transitionName + '-' + animationType, end);
    } else {
      this.stopper = props.animation[animationType](node, end);
    }
  },

  stop: function stop() {
    if (this.stopper) {
      this.stopper.stop();
      this.stopper = null;
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.stop();
  },

  componentWillEnter: function componentWillEnter(done) {
    var props = this.props;
    if (props.transitionEnter && props.transitionName || props.animation.enter) {
      this.transition('enter', done);
    } else {
      done();
    }
  },

  componentWillLeave: function componentWillLeave(done) {
    var props = this.props;
    if (props.transitionLeave && props.transitionName || props.animation.leave) {
      this.transition('leave', done);
    } else {
      done();
    }
  },

  render: function render() {
    return this.props.children;
  }
});

exports['default'] = AnimateChild;
module.exports = exports['default'];