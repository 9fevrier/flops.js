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


}

const ops = flopsify(Ops)
const x = ops.hello('Poulet')
x.howAreYou()
x.done((instance) => {
  console.log(instance.store)
}).error((err) => {
  console.error(err)
})


/*
x.next((instance) => {
  console.log(instance)
})
  */