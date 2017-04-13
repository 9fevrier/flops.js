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

import {FlopsBase} from './flops-base'
import {Store} from './index'

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

export class PromiseStream extends FlopsBase {

  constructor() {
    super()
    this._stream = Promise.resolve()
    this._store = new Store()
    this._currentId = 0
  }

  get store() {
    return this._store
  }

  next(fn) {
    if (fn) {
      this._stream = this._stream
        .then(fn)
        .then((values) => {
          this._store.createOperation(fn.$name, values)
          return this
        })
    } else {
      this._stream = this._stream.then(() => {
        return Promise.resolve(this)
      })
    }
    return this
  }

  done(fn) {
    this._stream = this._stream.then(() => {
      return this
    }).then(fn)
    return this
  }

  error(fn) {
    this._stream = this._stream.catch(fn)
    return this
  }


  /*
   next(fn) {
   return this.add(fn).add((values) => {
   this._store.createOperation(values)
   return this
   })
   }
   */

}