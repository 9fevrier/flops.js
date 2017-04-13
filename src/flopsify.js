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

import {FlopsBase} from './index'

class MethodWrapper extends FlopsBase {

  constructor(target, proxy, name, receiver) {
    super()
    this._target = target
    this._proxy = proxy
    this._name = name
    this._receiver = receiver
  }

  get target() {
    return this._target
  }

  get proxy() {
    return this._proxy
  }

  get name() {
    return this._name
  }

  get receveiver() {
    return this.receveiver
  }

  get errorMethod() {
    return this.target.error
  }

  get nextMethod() {
    return this.target.next
  }

  get originalMethod() {
    return this._target[this._name]
  }

  simple() {
    if ((this.name !== 'valueOf') && (this._name in this.target.__proto__)) {
      return (...args) => {
        let t = this.originalMethod.bind(this.target, args)
        Object.defineProperty(t, '$name', {
          value: this._name.toString()
        });
        this.nextMethod.apply(this.target, [t])
        return this.proxy
      }
    } else {
      return Reflect.get(this.target, this._name, this.receiver)
    }
  }

  next() {
    return (...args) => {
      Object.defineProperty(args[0], '$name', {
        value: this._name.toString()
      });
      this.nextMethod.apply(this.target, args)
      return this.proxy
    }
  }

  error() {
    return (...args) => {
      this.errorMethod.apply(this.target, args)
      return this.proxy
    }
  }

  compose() {
    return (...args) => {
      console.log('this.proxy' + this.proxy)
      let t = this.originalMethod.bind(this.proxy, args)
      Object.defineProperty(t, '$name', {
        value: this._name.toString()
      });
      this.nextMethod.apply(this.target, [t])
      return this.proxy
    }
  }

}

export class Flopsify {

  constructor(clz) {

    this._reserved = ['next', 'done', 'error']
    this._clz = clz
    this._instance = new this._clz()
    this._handler = this.handler()
    this._target = null
    this._i = 0
  }

  proxify() {
    this._proxy = new Proxy(this._instance, this._handler)
    return this._proxy
  }

  handler() {
    const self = this
    return {
      get: (target, name, receiver) => {
        const methodWrapper = new MethodWrapper(target, this._proxy, name, receiver)
        if (!this._target) {
          this._target = target
        }
        return this.methodDispatcher(methodWrapper)
      }
    }
  }

  methodDispatcher(methodWrapper) {
    let fn
    if (methodWrapper.name.toString().indexOf('$') === 0) {
      fn = methodWrapper.compose()
    } else {
      switch (methodWrapper.name.toString()) {
        case 'next':
          fn = methodWrapper.next()
          break
        case 'error':
          fn = methodWrapper.error()
          break
        case 'store':
          fn = Reflect.get(methodWrapper.target, methodWrapper.name, methodWrapper.receiver)
          break
        default:
          fn = methodWrapper.simple()
          break
      }
    }
    return fn
  }

}

export function flopsify(clz) {
  return new Flopsify(clz).proxify()
}

