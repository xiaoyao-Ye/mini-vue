class ReactiveEffect {
  private _fn
  constructor(fn: Function) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map()
export function track(target: Object, key: string) {
  // target => key => dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

export function trigger(target: Object, key: string) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    effect.run()
  }
}

let activeEffect: any
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
