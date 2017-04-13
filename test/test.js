import {flopsify, Flops} from '../dist/flops-alpha.dist'


class Ops extends Flops {
  constructor() {
    super()
  }

  hello(name) {
    return Promise.resolve(`Hello ${name}`)
  }

  howAreYou() {
    console.log('passe ici')
    return Promise.resolve(`How are you ?`)
  }

  onze(n) {
    if (!n) return null
    return 11 * n
  }

  douze(n) {
    return 12/5
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

ops.next((instance) => {
  return 2
})
  .next((instance) => {
    return 3
  })
  .onze(111)
  .onze()
  .douze()
  .next((instance) => {
    console.log('result = ' + instance.store)
  })
  .error(console.error)

/*
 x.next((instance) => {
 console.log(instance)
 })
 */