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

export class Flopsify {

  constructor(clz) {

    this._reserved = ['next', 'done', 'error']
    this._clz = clz
    this._instance = new this._clz()
    this._handler = this.handler()
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
        console.log(target.constructor.name + ' ' + name.toString())
        const originalMethod = target[name]
        if (this._i === 0) {

          this._target = target
        }
        this._i++

          if (name in target.__proto__) {
            return (...args) => {
              originalMethod.apply(target, args)
              return this._proxy
            }
          } else {

          }

        /*
         console.log(name + ' ' + (name.toString() in self._reserved))
         if (name.toString() in self._reserved) {
         console.log('fonction réservée')
         return Reflect.get(target, name, receiver)
         } else {
         // return Reflect.get(target, name, receiver)
         console.log('normal method = ' + name.toString())
         return (...args) => {
         const targetFn = Reflect.get(target, name, receiver)
         const x = (...args) => {
         console.log('targetFn ' + name)
         target.next(targetFn.bind(target, args))
         console.log('targetFn2' + JSON.stringify(target))
         return target
         }

         return x(args)
         }


         }*/

      }
    }
  }


}

export function flopsify(clz) {
  return new Flopsify(clz).proxify()
}

