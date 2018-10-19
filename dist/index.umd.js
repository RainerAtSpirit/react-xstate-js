(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
  (factory((global.index = {}),global.React,global.PropTypes));
}(this, (function (exports,react,PropTypes) { 'use strict';

  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var STATE_DELIMITER = '.';
  var EMPTY_ACTIVITY_MAP = {};

  var State = /** @class */ (function () {
      function State(value, historyValue, history, actions, activities, data, 
      /**
       * Internal event queue
       */
      events) {
          if (actions === void 0) { actions = []; }
          if (activities === void 0) { activities = EMPTY_ACTIVITY_MAP; }
          if (data === void 0) { data = {}; }
          if (events === void 0) { events = []; }
          this.value = value;
          this.historyValue = historyValue;
          this.history = history;
          this.actions = actions;
          this.activities = activities;
          this.data = data;
          this.events = events;
      }
      State.from = function (stateValue) {
          if (stateValue instanceof State) {
              return stateValue;
          }
          return new State(stateValue);
      };
      State.inert = function (stateValue) {
          if (stateValue instanceof State) {
              if (!stateValue.actions.length) {
                  return stateValue;
              }
              return new State(stateValue.value, stateValue.historyValue, stateValue.history, [], stateValue.activities);
          }
          return State.from(stateValue);
      };
      State.prototype.toString = function () {
          if (typeof this.value === 'string') {
              return this.value;
          }
          var path = [];
          var marker = this.value;
          while (true) {
              if (typeof marker === 'string') {
                  path.push(marker);
                  break;
              }
              var _a = Object.keys(marker), firstKey = _a[0], otherKeys = _a.slice(1);
              if (otherKeys.length) {
                  return undefined;
              }
              path.push(firstKey);
              marker = marker[firstKey];
          }
          return path.join(STATE_DELIMITER);
      };
      return State;
  }());

  function getEventType(event) {
      try {
          return typeof event === 'string' || typeof event === 'number'
              ? "" + event
              : event.type;
      }
      catch (e) {
          throw new Error('Events must be strings or objects with a string event.type property.');
      }
  }
  function getActionType(action) {
      try {
          return typeof action === 'string' || typeof action === 'number'
              ? "" + action
              : typeof action === 'function'
                  ? action.name
                  : action.type;
      }
      catch (e) {
          throw new Error('Events must be strings or objects with a string event.type property.');
      }
  }
  function toStatePath(stateId, delimiter) {
      try {
          if (Array.isArray(stateId)) {
              return stateId;
          }
          return stateId.toString().split(delimiter);
      }
      catch (e) {
          throw new Error("'" + stateId + "' is not a valid state path.");
      }
  }
  function toStateValue(stateValue, delimiter) {
      if (stateValue instanceof State) {
          return stateValue.value;
      }
      if (typeof stateValue === 'object' && !(stateValue instanceof State)) {
          return stateValue;
      }
      var statePath = toStatePath(stateValue, delimiter);
      return pathToStateValue(statePath);
  }
  function pathToStateValue(statePath) {
      if (statePath.length === 1) {
          return statePath[0];
      }
      var value = {};
      var marker = value;
      for (var i = 0; i < statePath.length - 1; i++) {
          if (i === statePath.length - 2) {
              marker[statePath[i]] = statePath[i + 1];
          }
          else {
              marker[statePath[i]] = {};
              marker = marker[statePath[i]];
          }
      }
      return value;
  }
  function mapValues(collection, iteratee) {
      var result = {};
      Object.keys(collection).forEach(function (key) {
          result[key] = iteratee(collection[key], key, collection);
      });
      return result;
  }
  function mapFilterValues(collection, iteratee, predicate) {
      var result = {};
      Object.keys(collection).forEach(function (key) {
          var item = collection[key];
          if (!predicate(item)) {
              return;
          }
          result[key] = iteratee(item, key, collection);
      });
      return result;
  }
  /**
   * Retrieves a value at the given path.
   * @param props The deep path to the prop of the desired value
   */
  var path = function (props) { return function (object) {
      var result = object;
      for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
          var prop = props_1[_i];
          result = result[prop];
      }
      return result;
  }; };
  /**
   * Retrieves a value at the given path via the nested accessor prop.
   * @param props The deep path to the prop of the desired value
   */
  function nestedPath(props, accessorProp) {
      return function (object) {
          var result = object;
          for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
              var prop = props_2[_i];
              result = result[accessorProp][prop];
          }
          return result;
      };
  }
  var toStatePaths = function (stateValue) {
      if (typeof stateValue === 'string') {
          return [[stateValue]];
      }
      var result = flatMap(Object.keys(stateValue).map(function (key) {
          return toStatePaths(stateValue[key]).map(function (subPath) {
              return [key].concat(subPath);
          });
      }));
      return result;
  };
  var pathsToStateValue = function (paths) {
      var result = {};
      if (paths && paths.length === 1 && paths[0].length === 1) {
          return paths[0][0];
      }
      for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
          var currentPath = paths_1[_i];
          var marker = result;
          // tslint:disable-next-line:prefer-for-of
          for (var i = 0; i < currentPath.length; i++) {
              var subPath = currentPath[i];
              if (i === currentPath.length - 2) {
                  marker[subPath] = currentPath[i + 1];
                  break;
              }
              marker[subPath] = marker[subPath] || {};
              marker = marker[subPath];
          }
      }
      return result;
  };
  var flatMap = function (array) {
      return array.reduce(function (a, b) { return a.concat(b); }, []);
  };

  function matchesState(parentStateId, childStateId, delimiter) {
      if (delimiter === void 0) { delimiter = STATE_DELIMITER; }
      var parentStateValue = toStateValue(parentStateId, delimiter);
      var childStateValue = toStateValue(childStateId, delimiter);
      if (typeof childStateValue === 'string') {
          if (typeof parentStateValue === 'string') {
              return childStateValue === parentStateValue;
          }
          // Parent more specific than child
          return false;
      }
      if (typeof parentStateValue === 'string') {
          return parentStateValue in childStateValue;
      }
      return Object.keys(parentStateValue).every(function (key) {
          if (!(key in childStateValue)) {
              return false;
          }
          return matchesState(parentStateValue[key], childStateValue[key]);
      });
  }

  var PREFIX = 'xstate';
  // xstate-specific action types
  var actionTypes = {
      start: PREFIX + ".start",
      stop: PREFIX + ".stop",
      raise: PREFIX + ".raise",
      send: PREFIX + ".send",
      cancel: PREFIX + ".cancel",
      null: PREFIX + ".null"
  };
  var createActivityAction = function (actionType) { return function (activity) {
      var data = typeof activity === 'string' || typeof activity === 'number'
          ? { type: activity }
          : activity;
      return {
          type: actionType,
          activity: getEventType(activity),
          data: data
      };
  }; };
  var toEventObject = function (event) {
      if (typeof event === 'string' || typeof event === 'number') {
          return { type: event };
      }
      return event;
  };
  var start = createActivityAction(actionTypes.start);
  var stop = createActivityAction(actionTypes.stop);

  var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var STATE_DELIMITER$1 = '.';
  var HISTORY_KEY = '$history';
  var NULL_EVENT = '';
  var STATE_IDENTIFIER = '#';
  var isStateId = function (str) { return str[0] === STATE_IDENTIFIER; };
  var defaultOptions = {
      guards: {}
  };
  var StateNode = /** @class */ (function () {
      function StateNode(config, options) {
          if (options === void 0) { options = defaultOptions; }
          var _this = this;
          this.config = config;
          this.options = options;
          this.__cache = {
              events: undefined,
              relativeValue: new Map(),
              initialState: undefined
          };
          this.idMap = {};
          this.key = config.key || '(machine)';
          this.parent = config.parent;
          this.machine = this.parent ? this.parent.machine : this;
          this.path = this.parent ? this.parent.path.concat(this.key) : [];
          this.delimiter =
              config.delimiter ||
                  (this.parent ? this.parent.delimiter : STATE_DELIMITER$1);
          this.id =
              config.id ||
                  (this.machine
                      ? [this.machine.key].concat(this.path).join(this.delimiter)
                      : this.key);
          this.initial = config.initial;
          this.parallel = !!config.parallel;
          this.states = (config.states
              ? mapValues(config.states, function (stateConfig, key) {
                  var _a;
                  var stateNode = new StateNode(__assign({}, stateConfig, { key: key, parent: _this }));
                  Object.assign(_this.idMap, __assign((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
                  return stateNode;
              })
              : {});
          // History config
          this.history =
              config.history === true ? 'shallow' : config.history || false;
          this.on = config.on ? this.formatTransitions(config.on) : {};
          this.transient = !!this.on[NULL_EVENT];
          this.strict = !!config.strict;
          this.onEntry = config.onEntry
              ? [].concat(config.onEntry)
              : [];
          this.onExit = config.onExit ? [].concat(config.onExit) : [];
          this.data = config.data;
          this.activities = config.activities;
      }
      StateNode.prototype.getStateNodes = function (state) {
          var _this = this;
          var _a;
          if (!state) {
              return [];
          }
          var stateValue = state instanceof State
              ? state.value
              : toStateValue(state, this.delimiter);
          if (typeof stateValue === 'string') {
              var initialStateValue = this.getStateNode(stateValue).initial;
              return initialStateValue
                  ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a))
                  : [this.states[stateValue]];
          }
          var subStateKeys = Object.keys(stateValue);
          var subStateNodes = subStateKeys.map(function (subStateKey) {
              return _this.getStateNode(subStateKey);
          });
          return subStateNodes.concat(subStateKeys.reduce(function (allSubStateNodes, subStateKey) {
              var subStateNode = _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
              return allSubStateNodes.concat(subStateNode);
          }, []));
      };
      StateNode.prototype.handles = function (event) {
          var eventType = getEventType(event);
          return this.events.indexOf(eventType) !== -1;
      };
      StateNode.prototype._transitionLeafNode = function (stateValue, state, event, extendedState) {
          var stateNode = this.getStateNode(stateValue);
          var next = stateNode._next(state, event, extendedState);
          if (!next.value) {
              var _a = this._next(state, event, extendedState), value = _a.value, entryExitStates = _a.entryExitStates, actions = _a.actions, paths = _a.paths;
              return {
                  value: value,
                  entryExitStates: {
                      entry: entryExitStates ? entryExitStates.entry : new Set(),
                      exit: new Set([
                          stateNode
                      ].concat((entryExitStates
                          ? Array.from(entryExitStates.exit)
                          : [])))
                  },
                  actions: actions,
                  paths: paths
              };
          }
          return next;
      };
      StateNode.prototype._transitionHierarchicalNode = function (stateValue, state, event, extendedState) {
          var subStateKeys = Object.keys(stateValue);
          var stateNode = this.getStateNode(subStateKeys[0]);
          var next = stateNode._transition(stateValue[subStateKeys[0]], state, event, extendedState);
          if (!next.value) {
              var _a = this._next(state, event, extendedState), value = _a.value, entryExitStates = _a.entryExitStates, actions = _a.actions, paths = _a.paths;
              return {
                  value: value,
                  entryExitStates: {
                      entry: entryExitStates ? entryExitStates.entry : new Set(),
                      exit: new Set((next.entryExitStates
                          ? Array.from(next.entryExitStates.exit)
                          : []).concat([
                          stateNode
                      ], (entryExitStates
                          ? Array.from(entryExitStates.exit)
                          : [])))
                  },
                  actions: actions,
                  paths: paths
              };
          }
          return next;
      };
      StateNode.prototype._transitionOrthogonalNode = function (stateValue, state, event, extendedState) {
          var _this = this;
          var transitionMap = {};
          Object.keys(stateValue).forEach(function (subStateKey) {
              var subStateValue = stateValue[subStateKey];
              if (!subStateValue) {
                  return;
              }
              var next = _this.getStateNode(subStateKey)._transition(subStateValue, state, event, extendedState);
              if (!next.value) ;
              transitionMap[subStateKey] = next;
          });
          var willTransition = Object.keys(transitionMap).some(function (key) { return transitionMap[key].value !== undefined; });
          if (!willTransition) {
              var _a = this._next(state, event, extendedState), value = _a.value, entryExitStates = _a.entryExitStates, actions = _a.actions, paths = _a.paths;
              return {
                  value: value,
                  entryExitStates: {
                      entry: entryExitStates ? entryExitStates.entry : new Set(),
                      exit: new Set(Object.keys(this.states).map(function (key) { return _this.states[key]; }).concat((entryExitStates ? Array.from(entryExitStates.exit) : [])))
                  },
                  actions: actions,
                  paths: paths
              };
          }
          var allPaths = flatMap(Object.keys(transitionMap).map(function (key) { return transitionMap[key].paths; }));
          // External transition that escapes orthogonal region
          if (allPaths.length === 1 &&
              !matchesState(pathToStateValue(this.path), pathToStateValue(allPaths[0]))) {
              return {
                  value: this.machine.resolve(pathsToStateValue(allPaths)),
                  entryExitStates: Object.keys(transitionMap)
                      .map(function (key) { return transitionMap[key].entryExitStates; })
                      .reduce(function (allEntryExitStates, entryExitStates) {
                      var _a = entryExitStates, entry = _a.entry, exit = _a.exit;
                      return {
                          entry: new Set(Array.from(allEntryExitStates.entry).concat(Array.from(entry))),
                          exit: new Set(Array.from(allEntryExitStates.exit).concat(Array.from(exit)))
                      };
                  }, { entry: new Set(), exit: new Set() }),
                  actions: flatMap(Object.keys(transitionMap).map(function (key) {
                      return transitionMap[key].actions;
                  })),
                  paths: allPaths
              };
          }
          var allResolvedPaths = flatMap(Object.keys(transitionMap).map(function (key) {
              var transition = transitionMap[key];
              var value = transition.value || state.value;
              return toStatePaths(path(_this.path)(value)[key]).map(function (statePath) {
                  return _this.path.concat(key, statePath);
              });
          }));
          var nextStateValue = this.machine.resolve(pathsToStateValue(allResolvedPaths));
          return {
              value: nextStateValue,
              entryExitStates: Object.keys(transitionMap).reduce(function (allEntryExitStates, key) {
                  var _a = transitionMap[key], subStateValue = _a.value, entryExitStates = _a.entryExitStates;
                  // If the event was not handled (no subStateValue),
                  // machine should still be in state without reentry/exit.
                  if (!subStateValue || !entryExitStates) {
                      return allEntryExitStates;
                  }
                  var entry = entryExitStates.entry, exit = entryExitStates.exit;
                  return {
                      entry: new Set(Array.from(allEntryExitStates.entry).concat(Array.from(entry))),
                      exit: new Set(Array.from(allEntryExitStates.exit).concat(Array.from(exit)))
                  };
              }, { entry: new Set(), exit: new Set() }),
              actions: flatMap(Object.keys(transitionMap).map(function (key) {
                  return transitionMap[key].actions;
              })),
              paths: toStatePaths(nextStateValue)
          };
      };
      StateNode.prototype._transition = function (stateValue, state, event, extendedState) {
          // leaf node
          if (typeof stateValue === 'string') {
              return this._transitionLeafNode(stateValue, state, event, extendedState);
          }
          // hierarchical node
          if (Object.keys(stateValue).length === 1) {
              return this._transitionHierarchicalNode(stateValue, state, event, extendedState);
          }
          // orthogonal node
          return this._transitionOrthogonalNode(stateValue, state, event, extendedState);
      };
      StateNode.prototype._next = function (state, event, extendedState) {
          var _this = this;
          var eventType = getEventType(event);
          var candidates = this.on[eventType];
          var actions = this.transient
              ? [{ type: actionTypes.null }]
              : [];
          if (!candidates || !candidates.length) {
              return {
                  value: undefined,
                  entryExitStates: undefined,
                  actions: actions,
                  paths: []
              };
          }
          var nextStateStrings = [];
          var selectedTransition;
          for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
              var candidate = candidates_1[_i];
              var _a = candidate, cond = _a.cond, stateIn = _a.in
              // actions: transitionActions
              ;
              var extendedStateObject = extendedState || {};
              var eventObject = toEventObject(event);
              var isInState = stateIn
                  ? matchesState(toStateValue(stateIn, this.delimiter), path(this.path.slice(0, -2))(state.value))
                  : true;
              if ((!cond ||
                  this._evaluateCond(cond, extendedStateObject, eventObject, state.value)) &&
                  (!stateIn || isInState)) {
                  nextStateStrings = Array.isArray(candidate.target)
                      ? candidate.target
                      : [candidate.target];
                  actions.push.apply(actions, (candidate.actions ? candidate.actions : [])); // TODO: fixme;
                  selectedTransition = candidate;
                  break;
              }
          }
          if (nextStateStrings.length === 0) {
              return {
                  value: undefined,
                  entryExitStates: undefined,
                  actions: actions,
                  paths: []
              };
          }
          var nextStateNodes = flatMap(nextStateStrings.map(function (str) {
              return _this.getRelativeStateNodes(str, state.historyValue);
          }));
          var nextStatePaths = nextStateNodes.map(function (stateNode) { return stateNode.path; });
          var entryExitStates = nextStateNodes.reduce(function (allEntryExitStates, nextStateNode) {
              var _a = _this._getEntryExitStates(nextStateNode, !!selectedTransition.internal), entry = _a.entry, exit = _a.exit;
              return {
                  entry: new Set(Array.from(allEntryExitStates.entry).concat(Array.from(entry))),
                  exit: new Set(Array.from(allEntryExitStates.exit).concat(Array.from(exit)))
              };
          }, { entry: new Set(), exit: new Set() });
          return {
              value: this.machine.resolve(pathsToStateValue(flatMap(nextStateStrings.map(function (str) {
                  return _this.getRelativeStateNodes(str, state.historyValue).map(function (s) { return s.path; });
              })))),
              entryExitStates: entryExitStates,
              actions: actions,
              paths: nextStatePaths
          };
      };
      StateNode.prototype._getEntryExitStates = function (nextStateNode, internal) {
          var entryExitStates = {
              entry: [],
              exit: []
          };
          var fromPath = this.path;
          var toPath = nextStateNode.path;
          var parent = this.machine;
          for (var i = 0; i < Math.min(fromPath.length, toPath.length); i++) {
              var fromPathSegment = fromPath[i];
              var toPathSegment = toPath[i];
              if (fromPathSegment === toPathSegment) {
                  parent = parent.getStateNode(fromPathSegment);
              }
              else {
                  break;
              }
          }
          var commonAncestorPath = parent.path;
          var marker = parent;
          for (var _i = 0, _a = fromPath.slice(commonAncestorPath.length); _i < _a.length; _i++) {
              var segment = _a[_i];
              marker = marker.getStateNode(segment);
              entryExitStates.exit.unshift(marker);
          }
          // Child node
          if (parent === this) {
              if (!internal) {
                  entryExitStates.exit.push(this);
                  entryExitStates.entry.push(this);
              }
          }
          marker = parent;
          for (var _b = 0, _c = toPath.slice(commonAncestorPath.length); _b < _c.length; _b++) {
              var segment = _c[_b];
              marker = marker.getStateNode(segment);
              entryExitStates.entry.push(marker);
          }
          return {
              entry: new Set(entryExitStates.entry),
              exit: new Set(entryExitStates.exit)
          };
      };
      StateNode.prototype._evaluateCond = function (condition, extendedState, eventObject, interimState) {
          var condFn;
          if (typeof condition === 'string') {
              if (!this.machine.options.guards[condition]) {
                  throw new Error("String condition '" + condition + "' is not defined on machine '" + this.machine.id + "'");
              }
              condFn = this.machine.options.guards[condition];
          }
          else {
              condFn = condition;
          }
          return condFn(extendedState, eventObject, interimState);
      };
      StateNode.prototype._getActions = function (transition) {
          var entryExitActions = {
              entry: transition.entryExitStates
                  ? flatMap(Array.from(transition.entryExitStates.entry).map(function (n) { return n.onEntry.concat((n.activities
                      ? n.activities.map(function (activity) { return start(activity); })
                      : [])); }))
                  : [],
              exit: transition.entryExitStates
                  ? flatMap(Array.from(transition.entryExitStates.exit).map(function (n) { return n.onExit.concat((n.activities
                      ? n.activities.map(function (activity) { return stop(activity); })
                      : [])); }))
                  : []
          };
          var actions = (entryExitActions.exit || [])
              .concat(transition.actions || [])
              .concat(entryExitActions.entry || []);
          return actions;
      };
      StateNode.prototype._getActivities = function (state, transition) {
          if (!transition.entryExitStates) {
              return {};
          }
          var activityMap = __assign({}, state.activities);
          Array.from(transition.entryExitStates.exit).forEach(function (stateNode) {
              if (!stateNode.activities) {
                  return; // TODO: fixme
              }
              stateNode.activities.forEach(function (activity) {
                  activityMap[getActionType(activity)] = false;
              });
          });
          Array.from(transition.entryExitStates.entry).forEach(function (stateNode) {
              if (!stateNode.activities) {
                  return; // TODO: fixme
              }
              stateNode.activities.forEach(function (activity) {
                  activityMap[getActionType(activity)] = true;
              });
          });
          return activityMap;
      };
      StateNode.prototype.transition = function (state, event, extendedState) {
          var _a;
          var resolvedStateValue = typeof state === 'string'
              ? this.resolve(pathToStateValue(this.getResolvedPath(state)))
              : state instanceof State
                  ? state
                  : this.resolve(state);
          var eventType = getEventType(event);
          if (this.strict) {
              if (this.events.indexOf(eventType) === -1) {
                  throw new Error("Machine '" + this.id + "' does not accept event '" + eventType + "'");
              }
          }
          var currentState = State.from(resolvedStateValue);
          var historyValue = resolvedStateValue instanceof State
              ? resolvedStateValue.historyValue
                  ? resolvedStateValue.historyValue
                  : this.machine.historyValue(resolvedStateValue.value)
              : this.machine.historyValue(resolvedStateValue);
          var stateTransition = this._transition(currentState.value, currentState, event, extendedState);
          try {
              this.ensureValidPaths(stateTransition.paths);
          }
          catch (e) {
              throw new Error("Event '" + eventType + "' leads to an invalid configuration: " + e.message);
          }
          var actions = this._getActions(stateTransition);
          var activities = this._getActivities(currentState, stateTransition);
          var raisedEvents = actions.filter(function (action) {
              return typeof action === 'object' &&
                  (action.type === actionTypes.raise || action.type === actionTypes.null);
          });
          var nonEventActions = actions.filter(function (action) {
              return typeof action !== 'object' ||
                  (action.type !== actionTypes.raise && action.type !== actionTypes.null);
          });
          var stateNodes = stateTransition.value
              ? this.getStateNodes(stateTransition.value)
              : [];
          var isTransient = stateNodes.some(function (stateNode) { return stateNode.transient; });
          if (isTransient) {
              raisedEvents.push({ type: actionTypes.null });
          }
          var data = {};
          stateNodes.forEach(function (stateNode) {
              data[stateNode.id] = stateNode.data;
          });
          var nextState = stateTransition.value
              ? new State(stateTransition.value, StateNode.updateHistoryValue(historyValue, stateTransition.value), currentState, nonEventActions, activities, data, raisedEvents)
              : undefined;
          if (!nextState) {
              // Unchanged state should be returned with no actions
              return State.inert(currentState);
          }
          // Dispose of previous histories to prevent memory leaks
          delete currentState.history;
          var maybeNextState = nextState;
          while (raisedEvents.length) {
              var currentActions = maybeNextState.actions;
              var raisedEvent = raisedEvents.shift();
              maybeNextState = this.transition(maybeNextState, raisedEvent.type === actionTypes.null ? NULL_EVENT : raisedEvent.event, extendedState);
              (_a = maybeNextState.actions).unshift.apply(_a, currentActions);
          }
          return maybeNextState;
      };
      StateNode.prototype.ensureValidPaths = function (paths) {
          var _this = this;
          var visitedParents = new Map();
          var stateNodes = flatMap(paths.map(function (_path) { return _this.getRelativeStateNodes(_path); }));
          outer: for (var _i = 0, stateNodes_1 = stateNodes; _i < stateNodes_1.length; _i++) {
              var stateNode = stateNodes_1[_i];
              var marker = stateNode;
              while (marker.parent) {
                  if (visitedParents.has(marker.parent)) {
                      if (marker.parent.parallel) {
                          continue outer;
                      }
                      throw new Error("State node '" + stateNode.id + "' shares parent '" + marker.parent.id + "' with state node '" + visitedParents
                          .get(marker.parent)
                          .map(function (a) { return a.id; }) + "'");
                  }
                  if (!visitedParents.get(marker.parent)) {
                      visitedParents.set(marker.parent, [stateNode]);
                  }
                  else {
                      visitedParents.get(marker.parent).push(stateNode);
                  }
                  marker = marker.parent;
              }
          }
      };
      StateNode.prototype.getStateNode = function (stateKey) {
          if (isStateId(stateKey)) {
              return this.machine.getStateNodeById(stateKey);
          }
          if (!this.states) {
              throw new Error("Unable to retrieve child state '" + stateKey + "' from '" + this.id + "'; no child states exist.");
          }
          var result = this.states[stateKey];
          if (!result) {
              throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
          }
          return result;
      };
      StateNode.prototype.getStateNodeById = function (stateId) {
          var resolvedStateId = isStateId(stateId)
              ? stateId.slice(STATE_IDENTIFIER.length)
              : stateId;
          var stateNode = this.machine.idMap[resolvedStateId];
          if (!stateNode) {
              throw new Error("Substate '#" + resolvedStateId + "' does not exist on '" + this.id + "'");
          }
          return stateNode;
      };
      StateNode.prototype.getStateNodeByPath = function (statePath) {
          var arrayStatePath = toStatePath(statePath, this.delimiter);
          var currentStateNode = this;
          while (arrayStatePath.length) {
              var key = arrayStatePath.shift();
              currentStateNode = currentStateNode.getStateNode(key);
          }
          return currentStateNode;
      };
      StateNode.prototype.resolve = function (stateValue) {
          var _this = this;
          var _a;
          if (typeof stateValue === 'string') {
              var subStateNode = this.getStateNode(stateValue);
              return subStateNode.initial
                  ? (_a = {}, _a[stateValue] = subStateNode.initialStateValue, _a) : stateValue;
          }
          if (this.parallel) {
              return mapValues(this.initialStateValue, function (subStateValue, subStateKey) {
                  return subStateValue
                      ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue)
                      : {};
              });
          }
          return mapValues(stateValue, function (subStateValue, subStateKey) {
              return subStateValue
                  ? _this.getStateNode(subStateKey).resolve(subStateValue)
                  : {};
          });
      };
      Object.defineProperty(StateNode.prototype, "resolvedStateValue", {
          get: function () {
              var _a, _b;
              var key = this.key;
              if (this.parallel) {
                  return _a = {},
                      _a[key] = mapFilterValues(this.states, function (stateNode) { return stateNode.resolvedStateValue[stateNode.key]; }, function (stateNode) { return !stateNode.history; }),
                      _a;
              }
              if (!this.initial) {
                  // If leaf node, value is just the state node's key
                  return key;
              }
              return _b = {},
                  _b[key] = this.states[this.initial].resolvedStateValue,
                  _b;
          },
          enumerable: true,
          configurable: true
      });
      StateNode.prototype.getResolvedPath = function (stateIdentifier) {
          if (isStateId(stateIdentifier)) {
              var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];
              if (!stateNode) {
                  throw new Error("Unable to find state node '" + stateIdentifier + "'");
              }
              return stateNode.path;
          }
          return toStatePath(stateIdentifier, this.delimiter);
      };
      Object.defineProperty(StateNode.prototype, "initialStateValue", {
          get: function () {
              if (this.__cache.initialState) {
                  return this.__cache.initialState;
              }
              var initialStateValue = (this.parallel
                  ? mapFilterValues(this.states, function (state) { return state.initialStateValue || {}; }, function (stateNode) { return !stateNode.history; })
                  : typeof this.resolvedStateValue === 'string'
                      ? undefined
                      : this.resolvedStateValue[this.key]);
              this.__cache.initialState = initialStateValue;
              return this.__cache.initialState;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(StateNode.prototype, "initialState", {
          get: function () {
              var _a;
              var initialStateValue = this.initialStateValue;
              if (!initialStateValue) {
                  throw new Error("Cannot retrieve initial state from simple state '" + this.id + ".'");
              }
              var activityMap = {};
              var actions = [];
              this.getStateNodes(initialStateValue).forEach(function (stateNode) {
                  if (stateNode.onEntry) {
                      actions.push.apply(actions, stateNode.onEntry);
                  }
                  if (stateNode.activities) {
                      stateNode.activities.forEach(function (activity) {
                          activityMap[getEventType(activity)] = true;
                          actions.push(start(activity));
                      });
                  }
              });
              // TODO: deduplicate - DRY (from this.transition())
              var raisedEvents = actions.filter(function (action) {
                  return typeof action === 'object' &&
                      (action.type === actionTypes.raise || action.type === actionTypes.null);
              });
              var initialState = new State(initialStateValue, undefined, undefined, actions, activityMap);
              var maybeNextState = initialState;
              while (raisedEvents.length) {
                  var currentActions = maybeNextState.actions;
                  var raisedEvent = raisedEvents.shift();
                  maybeNextState = this.transition(maybeNextState, raisedEvent.type === actionTypes.null ? NULL_EVENT : raisedEvent.event, undefined // TODO: consider initial state given external state
                  );
                  (_a = maybeNextState.actions).unshift.apply(_a, currentActions);
              }
              return maybeNextState;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(StateNode.prototype, "target", {
          get: function () {
              var target;
              if (this.history) {
                  var historyConfig = this.config;
                  if (historyConfig.target && typeof historyConfig.target === 'string') {
                      target = isStateId(historyConfig.target)
                          ? pathToStateValue(this.machine
                              .getStateNodeById(historyConfig.target)
                              .path.slice(this.path.length - 1))
                          : historyConfig.target;
                  }
                  else {
                      target = historyConfig.target;
                  }
              }
              return target;
          },
          enumerable: true,
          configurable: true
      });
      StateNode.prototype.getStates = function (stateValue) {
          var _this = this;
          if (typeof stateValue === 'string') {
              return [this.states[stateValue]];
          }
          var stateNodes = [];
          Object.keys(stateValue).forEach(function (key) {
              stateNodes.push.apply(stateNodes, _this.states[key].getStates(stateValue[key]));
          });
          return stateNodes;
      };
      /**
       * Returns the leaf nodes from a state path relative to this state node.
       *
       * @param relativeStateId The relative state path to retrieve the state nodes
       * @param history The previous state to retrieve history
       * @param resolve Whether state nodes should resolve to initial child state nodes
       */
      StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
          if (resolve === void 0) { resolve = true; }
          if (typeof relativeStateId === 'string' && isStateId(relativeStateId)) {
              var unresolvedStateNode = this.getStateNodeById(relativeStateId);
              return resolve
                  ? unresolvedStateNode.history
                      ? unresolvedStateNode.resolveHistory(historyValue)
                      : unresolvedStateNode.initialStateNodes
                  : [unresolvedStateNode];
          }
          var statePath = toStatePath(relativeStateId, this.delimiter);
          var rootStateNode = this.parent || this;
          var unresolvedStateNodes = rootStateNode.getFromRelativePath(statePath, historyValue);
          if (!resolve) {
              return unresolvedStateNodes;
          }
          return flatMap(unresolvedStateNodes.map(function (stateNode) { return stateNode.initialStateNodes; }));
      };
      Object.defineProperty(StateNode.prototype, "initialStateNodes", {
          get: function () {
              var _this = this;
              // todo - isLeafNode or something
              if (!this.parallel && !this.initial) {
                  return [this];
              }
              var initialState = this.initialState;
              var initialStateNodePaths = toStatePaths(initialState.value);
              return flatMap(initialStateNodePaths.map(function (initialPath) {
                  return _this.getFromRelativePath(initialPath);
              }));
          },
          enumerable: true,
          configurable: true
      });
      /**
       * Retrieves state nodes from a relative path to this state node.
       *
       * @param relativePath The relative path from this state node
       * @param historyValue
       */
      StateNode.prototype.getFromRelativePath = function (relativePath, historyValue) {
          var _this = this;
          if (!relativePath.length) {
              return [this];
          }
          var x = relativePath[0], xs = relativePath.slice(1);
          if (!this.states) {
              throw new Error("Cannot retrieve subPath '" + x + "' from node with no states");
          }
          // TODO: remove (4.0)
          if (x === HISTORY_KEY) {
              if (!historyValue) {
                  return [this];
              }
              var subHistoryValue = nestedPath(this.path, 'states')(historyValue).current;
              if (typeof subHistoryValue === 'string') {
                  return this.states[subHistoryValue].getFromRelativePath(xs, historyValue);
              }
              return flatMap(Object.keys(subHistoryValue).map(function (key) {
                  return _this.states[key].getFromRelativePath(xs, historyValue);
              }));
          }
          var childStateNode = this.getStateNode(x);
          if (childStateNode.history) {
              return childStateNode.resolveHistory(historyValue);
          }
          if (!this.states[x]) {
              throw new Error("Child state '" + x + "' does not exist on '" + this.id + "'");
          }
          return this.states[x].getFromRelativePath(xs, historyValue);
      };
      StateNode.updateHistoryValue = function (hist, stateValue) {
          function update(_hist, _sv) {
              return mapValues(_hist.states, function (subHist, key) {
                  if (!subHist) {
                      return undefined;
                  }
                  var subStateValue = (typeof _sv === 'string' ? undefined : _sv[key]) ||
                      (subHist ? subHist.current : undefined);
                  if (!subStateValue) {
                      return undefined;
                  }
                  return {
                      current: subStateValue,
                      states: update(subHist, subStateValue)
                  };
              });
          }
          return {
              current: stateValue,
              states: update(hist, stateValue)
          };
      };
      StateNode.prototype.historyValue = function (relativeStateValue) {
          if (!Object.keys(this.states).length) {
              return undefined;
          }
          return {
              current: relativeStateValue || this.initialStateValue,
              states: mapFilterValues(this.states, function (stateNode, key) {
                  if (!relativeStateValue) {
                      return stateNode.historyValue();
                  }
                  var subStateValue = typeof relativeStateValue === 'string'
                      ? undefined
                      : relativeStateValue[key];
                  return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
              }, function (stateNode) { return !stateNode.history; })
          };
      };
      /**
       * Resolves to the historical value(s) of the parent state node,
       * represented by state nodes.
       *
       * @param historyValue
       */
      StateNode.prototype.resolveHistory = function (historyValue) {
          var _this = this;
          if (!this.history) {
              return [this];
          }
          var parent = this.parent;
          if (!historyValue) {
              return this.target
                  ? flatMap(toStatePaths(this.target).map(function (relativeChildPath) {
                      return parent.getFromRelativePath(relativeChildPath);
                  }))
                  : this.parent.initialStateNodes;
          }
          var subHistoryValue = nestedPath(parent.path, 'states')(historyValue).current;
          if (typeof subHistoryValue === 'string') {
              return [parent.getStateNode(subHistoryValue)];
          }
          return flatMap(toStatePaths(subHistoryValue).map(function (subStatePath) {
              return _this.history === 'deep'
                  ? parent.getFromRelativePath(subStatePath)
                  : [parent.states[subStatePath[0]]];
          }));
      };
      Object.defineProperty(StateNode.prototype, "events", {
          get: function () {
              if (this.__cache.events) {
                  return this.__cache.events;
              }
              var states = this.states;
              var events = new Set(Object.keys(this.on));
              if (states) {
                  Object.keys(states).forEach(function (stateId) {
                      var state = states[stateId];
                      if (state.states) {
                          for (var _i = 0, _a = state.events; _i < _a.length; _i++) {
                              var event_1 = _a[_i];
                              events.add("" + event_1);
                          }
                      }
                  });
              }
              return (this.__cache.events = Array.from(events));
          },
          enumerable: true,
          configurable: true
      });
      StateNode.prototype.formatTransition = function (targets, transitionConfig) {
          var _this = this;
          var internal = transitionConfig ? transitionConfig.internal : false;
          // Format targets to their full string path
          var formattedTargets = targets.map(function (target) {
              var internalTarget = typeof target === 'string' && target[0] === _this.delimiter;
              internal = internal || internalTarget;
              // If internal target is defined on machine,
              // do not include machine key on target
              if (internalTarget && !_this.parent) {
                  return target.slice(1);
              }
              return internalTarget ? _this.key + target : target;
          });
          return __assign({}, transitionConfig, { target: formattedTargets, internal: internal });
      };
      StateNode.prototype.formatTransitions = function (onConfig) {
          var _this = this;
          return mapValues(onConfig, function (value) {
              if (value === undefined) {
                  return [];
              }
              if (Array.isArray(value)) {
                  return value.map(function (targetTransitionConfig) {
                      return _this.formatTransition([].concat(targetTransitionConfig.target), targetTransitionConfig);
                  });
              }
              if (typeof value === 'string') {
                  return [_this.formatTransition([value])];
              }
              return Object.keys(value).map(function (target) {
                  return _this.formatTransition([target], value[target]);
              });
          });
      };
      return StateNode;
  }());

  function Machine$1(config, options) {
      return new StateNode(config, options);
  }

  var MachineComponent =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MachineComponent, _Component);

    function MachineComponent(props) {
      var _this;

      _classCallCheck(this, MachineComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MachineComponent).call(this, props));
      _this.machine = Machine$1(_this.props.statechart);
      _this.state = {
        machineStateNode: _this.machine.initialState
      };
      _this.transition = _this.transition.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.triggerActionsCalcData = _this.triggerActionsCalcData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(MachineComponent, [{
      key: "transition",
      value: function transition(event) {
        var _this$state = this.state,
            currentData = _this$state.data,
            currentStateNode = _this$state.machineStateNode,
            triggerActionsCalcData = this.triggerActionsCalcData;
        var nextStateNode = this.machine.transition(currentStateNode, event.type);
        var newData = triggerActionsCalcData(nextStateNode, event);
        this.setState({
          machineStateNode: nextStateNode,
          data: _objectSpread({}, currentData, newData)
        });
      }
    }, {
      key: "triggerActionsCalcData",
      value: function triggerActionsCalcData(stateNode, event) {
        var actionMap = this.props.actionMap,
            transition = this.transition;
        return stateNode.actions.reduce(function (acc, actionKey) {
          return _objectSpread({}, acc, actionMap[actionKey](event, transition));
        }, {});
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var machine = this.machine;
        this.triggerActionsCalcData(machine.initialState, null);
      }
    }, {
      key: "render",
      value: function render() {
        var children = this.props.children,
            _this$state2 = this.state,
            machineStateNode = _this$state2.machineStateNode,
            data = _this$state2.data,
            transition = this.transition;
        return children({
          transition: transition,
          state: machineStateNode.value,
          data: data
        });
      }
    }]);

    return MachineComponent;
  }(react.Component);

  MachineComponent.propTypes = {
    statechart: PropTypes.object.isRequired,
    actionMap: PropTypes.object.isRequired
  };

  exports.Machine = MachineComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));