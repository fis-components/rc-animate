'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var utils = {
  toArrayChildren: function toArrayChildren(children) {
    var ret = [];
    _react2['default'].Children.forEach(children, function (c) {
      ret.push(c);
    });
    return ret;
  },

  findChildInChildrenByKey: function findChildInChildrenByKey(children, key) {
    var ret = null;
    if (children) {
      children.forEach(function (c) {
        if (ret) {
          return;
        }
        if (c.key === key) {
          ret = c;
        }
      });
    }
    return ret;
  },

  findShownChildInChildrenByKey: function findShownChildInChildrenByKey(children, key, showProp) {
    var ret = null;
    if (children) {
      children.forEach(function (c) {
        if (c.key === key && c.props[showProp]) {
          if (ret) {
            throw new Error('two child with same key for <rc-animate> children');
          }
          ret = c;
        }
      });
    }
    return ret;
  },

  findHiddenChildInChildrenByKey: function findHiddenChildInChildrenByKey(children, key, showProp) {
    var found = 0;
    if (children) {
      children.forEach(function (c) {
        if (found) {
          return;
        }
        found = c.key === key && !c.props[showProp];
      });
    }
    return found;
  },

  isSameChildren: function isSameChildren(c1, c2, showProp) {
    var same = c1.length === c2.length;
    if (same) {
      c1.forEach(function (child, i) {
        var child2 = c2[i];
        if (child.key !== child2.key) {
          same = false;
        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
          same = false;
        }
      });
    }
    return same;
  },

  mergeChildren: function mergeChildren(prev, next) {
    var ret = [];

    // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    var nextChildrenPending = {};
    var pendingChildren = [];
    prev.forEach(function (c) {
      if (utils.findChildInChildrenByKey(next, c.key)) {
        if (pendingChildren.length) {
          nextChildrenPending[c.key] = pendingChildren;
          pendingChildren = [];
        }
      } else {
        pendingChildren.push(c);
      }
    });

    next.forEach(function (c) {
      if (nextChildrenPending.hasOwnProperty(c.key)) {
        ret = ret.concat(nextChildrenPending[c.key]);
      }
      ret.push(c);
    });

    ret = ret.concat(pendingChildren);

    return ret;
  }
};

exports['default'] = utils;
module.exports = exports['default'];