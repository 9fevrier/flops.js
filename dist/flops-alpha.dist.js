/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017, 9 Février
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = exports.PromiseStream = exports.Operation = exports.FlopsBase = exports.flopsify = exports.Flopsify = exports.Flops = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('source-map-support/register');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var FlopsBase = function FlopsBase() {
  _classCallCheck(this, FlopsBase);

  this.$flops = true;
};


var PromiseStream$$1 = function (_FlopsBase) {
  _inherits(PromiseStream$$1, _FlopsBase);

  function PromiseStream$$1() {
    _classCallCheck(this, PromiseStream$$1);

    var _this = _possibleConstructorReturn(this, (PromiseStream$$1.__proto__ || Object.getPrototypeOf(PromiseStream$$1)).call(this));

    _this._stream = Promise.resolve();
    _this._store = new Store();
    _this._currentId = 0;
    return _this;
  }

  _createClass(PromiseStream$$1, [{
    key: 'next',
    value: function next(fn) {
      var _this2 = this;

      if (fn) {
        this._stream = this._stream.then(fn).then(function (values) {
          _this2._store.createOperation(fn.$name, values);
          return _this2;
        });
      } else {
        this._stream = this._stream.then(function () {
          return Promise.resolve(_this2);
        });
      }
      return this;
    }
  }, {
    key: 'done',
    value: function done(fn) {
      var _this3 = this;

      this._stream = this._stream.then(function () {
        return _this3;
      }).then(fn);
      return this;
    }
  }, {
    key: 'error',
    value: function error(fn) {
      this._stream = this._stream.catch(fn);
      return this;
    }


  }, {
    key: 'store',
    get: function get() {
      return this._store;
    }
  }]);

  return PromiseStream$$1;
}(FlopsBase);


var Flops = function (_FlopsBase2) {
  _inherits(Flops, _FlopsBase2);

  function Flops() {
    _classCallCheck(this, Flops);

    var _this4 = _possibleConstructorReturn(this, (Flops.__proto__ || Object.getPrototypeOf(Flops)).call(this));

    _this4._stream = new PromiseStream$$1();
    return _this4;
  }

  _createClass(Flops, [{
    key: 'next',
    value: function next(fn) {
      this._stream = this._stream.next(fn);
      return this;
    }
  }, {
    key: 'done',
    value: function done(fn) {
      this._stream = this._stream.done(fn);
      return this;
    }
  }, {
    key: 'error',
    value: function error(fn) {
      this._stream = this._stream.error(fn);
      return this;
    }
  }, {
    key: 'store',
    get: function get() {
      return this._stream.store;
    }
  }]);

  return Flops;
}(FlopsBase);


var MethodWrapper = function (_FlopsBase3) {
  _inherits(MethodWrapper, _FlopsBase3);

  function MethodWrapper(target, proxy, name, receiver) {
    _classCallCheck(this, MethodWrapper);

    var _this5 = _possibleConstructorReturn(this, (MethodWrapper.__proto__ || Object.getPrototypeOf(MethodWrapper)).call(this));

    _this5._target = target;
    _this5._proxy = proxy;
    _this5._name = name;
    _this5._receiver = receiver;
    return _this5;
  }

  _createClass(MethodWrapper, [{
    key: 'simple',
    value: function simple() {
      var _this6 = this;

      if (this.name !== 'valueOf' && this._name in this.target.__proto__) {
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var t = _this6.originalMethod.bind(_this6.target, args);
          Object.defineProperty(t, '$name', {
            value: _this6._name.toString()
          });
          _this6.nextMethod.apply(_this6.target, [t]);
          return _this6.proxy;
        };
      } else {
        return Reflect.get(this.target, this._name, this.receiver);
      }
    }
  }, {
    key: 'next',
    value: function next() {
      var _this7 = this;

      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        Object.defineProperty(args[0], '$name', {
          value: _this7._name.toString()
        });
        _this7.nextMethod.apply(_this7.target, args);
        return _this7.proxy;
      };
    }
  }, {
    key: 'error',
    value: function error() {
      var _this8 = this;

      return function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        _this8.errorMethod.apply(_this8.target, args);
        return _this8.proxy;
      };
    }
  }, {
    key: 'compose',
    value: function compose() {
      var _this9 = this;

      return function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        console.log('this.proxy' + _this9.proxy);
        var t = _this9.originalMethod.bind(_this9.proxy, args);
        Object.defineProperty(t, '$name', {
          value: _this9._name.toString()
        });
        _this9.nextMethod.apply(_this9.target, [t]);
        return _this9.proxy;
      };
    }
  }, {
    key: 'target',
    get: function get() {
      return this._target;
    }
  }, {
    key: 'proxy',
    get: function get() {
      return this._proxy;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'receveiver',
    get: function get() {
      return this.receveiver;
    }
  }, {
    key: 'errorMethod',
    get: function get() {
      return this.target.error;
    }
  }, {
    key: 'nextMethod',
    get: function get() {
      return this.target.next;
    }
  }, {
    key: 'originalMethod',
    get: function get() {
      return this._target[this._name];
    }
  }]);

  return MethodWrapper;
}(FlopsBase);

var Flopsify$$1 = function () {
  function Flopsify$$1(clz) {
    _classCallCheck(this, Flopsify$$1);

    this._reserved = ['next', 'done', 'error'];
    this._clz = clz;
    this._instance = new this._clz();
    this._handler = this.handler();
    this._target = null;
    this._i = 0;
  }

  _createClass(Flopsify$$1, [{
    key: 'proxify',
    value: function proxify() {
      this._proxy = new Proxy(this._instance, this._handler);
      return this._proxy;
    }
  }, {
    key: 'handler',
    value: function handler() {
      var _this10 = this;

      var self = this;
      return {
        get: function get(target, name, receiver) {
          var methodWrapper = new MethodWrapper(target, _this10._proxy, name, receiver);
          if (!_this10._target) {
            _this10._target = target;
          }
          return _this10.methodDispatcher(methodWrapper);
        }
      };
    }
  }, {
    key: 'methodDispatcher',
    value: function methodDispatcher(methodWrapper) {
      var fn = void 0;
      if (methodWrapper.name.toString().indexOf('$') === 0) {
        fn = methodWrapper.compose();
      } else {
        switch (methodWrapper.name.toString()) {
          case 'next':
            fn = methodWrapper.next();
            break;
          case 'error':
            fn = methodWrapper.error();
            break;
          case 'store':
            fn = Reflect.get(methodWrapper.target, methodWrapper.name, methodWrapper.receiver);
            break;
          default:
            fn = methodWrapper.simple();
            break;
        }
      }
      return fn;
    }
  }]);

  return Flopsify$$1;
}();

function flopsify$$1(clz) {
  return new Flopsify$$1(clz).proxify();
}


var Operation = function (_FlopsBase4) {
  _inherits(Operation, _FlopsBase4);

  function Operation(id, funcName, results) {
    _classCallCheck(this, Operation);

    var _this11 = _possibleConstructorReturn(this, (Operation.__proto__ || Object.getPrototypeOf(Operation)).call(this));

    _this11._id = id;
    _this11._functionName = funcName;
    _this11._uid = _uuid2.default.v4();
    _this11._results = results;
    return _this11;
  }

  return Operation;
}(FlopsBase);


var Store = function (_FlopsBase5) {
  _inherits(Store, _FlopsBase5);

  function Store() {
    _classCallCheck(this, Store);

    var _this12 = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this));

    _this12._currentId = 0;
    _this12._operations = [];
    return _this12;
  }

  _createClass(Store, [{
    key: 'add',
    value: function add(operation) {
      this._operations.push(operation);
      return this;
    }
  }, {
    key: 'createOperation',
    value: function createOperation(funcName, values) {
      var operation = void 0;
      console.log('typeof=' + (typeof values === 'undefined' ? 'undefined' : _typeof(values)));
      if (values instanceof Array) {
        var operations = values;
        console.log(operations.length);
        operations.forEach(function (op) {
          console.log('>>>' + op._results);
        });
        console.log('>>>> ' + operations._operations.length);
      } else {

        operation = new Operation(++this._currentId, funcName, values);
        this.add(operation);
      }

      return this;
    }
  }]);

  return Store;
}(FlopsBase);


exports.Flops = Flops;
exports.Flopsify = Flopsify$$1;
exports.flopsify = flopsify$$1;
exports.FlopsBase = FlopsBase;
exports.Operation = Operation;
exports.PromiseStream = PromiseStream$$1;
exports.Store = Store;
//# sourceMappingURL=flops-alpha.dist.js.map
