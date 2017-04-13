

import {flopsify, Flops} from '../dist/flops-alpha.dist'

import util from 'util'

class Ops extends Flops {
  constructor() {
    super()
    this.heurk = 5

  }

  hello(name) {
    return Promise.resolve(`Hello ${name}`)
  }

  howAreYou() {
    console.log('howAreYou')
    return Promise.resolve(`How are you ?`)
  }

  onze(n) {
    if (!n) return null
    return 11 * n
  }

  douze(n) {
    console.log('douze')
    return Promise.resolve(this.heurk * n)
  }

  $test() {
    console.log('$test')
    const r = this.douze(2)
    console.log(this)
    console.log('r=' + r)
    return r.douze(3)
  }


}

const ops = flopsify(Ops)

/*
 const x = ops.hello('Poulet')
 .howAreYou()
 .next((instance) => {
 console.log('result = ' + instance.store)
 })
 .error(console.error)

 console.log(x)
 */

ops.$test()
  .next((instance) => {
    console.log('FINAL result = ' + util.inspect(instance.store))
  })
  .error(console.error)

/*
 x.next((instance) => {
 console.log(instance)
 })
 */