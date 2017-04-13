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
import {Operation} from './operation'

export class Store extends FlopsBase {
  constructor() {
    super()
    this._currentId = 0
    this._operations = []
  }

  add(operation) {
    this._operations.push(operation)
    return this
  }

  createOperation(funcName, values) {
    let operation
    console.log('typeof=' + typeof(values))
     if (values instanceof Array) {
     const operations = values
       console.log(operations.length)
     operations.forEach((op) => {
       console.log('>>>' + op._results)
     })
     console.log('>>>> ' + operations._operations.length)
     } else {

    operation = new Operation(++this._currentId, funcName, values)
    this.add(operation)
    }

    return this
  }


}