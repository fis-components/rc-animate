'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function inChildren(children, child) {
  var found = 0;
  children.forEach(function (c) {
    if (found) {
      return;
    }
    found = c.key === child.key;
  });
  return found;
}

exports['default'] = {
  inChildren: inChildren,

  toArrayChildren: function toArrayChildren(children) {
    var ret = [];
    _react2['default'].Children.forEach(children, function (c) {
      ret.push(c);
    });
    return ret;
  },

  isShownInChildren: function isShownInChildren(children, child, showProp) {
    var found = 0;
    children.forEach(function (c) {
      if (found) {
        return;
      }
      found = c.key === child.key && c.props[showProp];
    });
    return found;
  },

  inChildrenByKey: function inChildrenByKey(children, key) {
    var found = 0;
    if (children) {
      children.forEach(function (c) {
        if (found) {
          return;
        }
        found = c.key === key;
      });
    }
    return found;
  },

  isShownInChildrenByKey: function isShownInChildrenByKey(children, key, showProp) {
    var found = 0;
    if (children) {
      children.forEach(function (c) {
        if (found) {
          return;
        }
        found = c.key === key && c.props[showProp];
      });
    }
    return found;
  },

  isSameChildren: function isSameChildren(c1, c2) {
    var same = c1.length === c2.length;
    if (same) {
      c1.forEach(function (c, i) {
        if (c !== c2[i]) {
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
      if (inChildren(next, c)) {
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
module.exports = exports['default'];