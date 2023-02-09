import { extend } from '../../shared';

class ReactiveEffect {
  private _fn;
  private scheduler;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    // 避免多次调用
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) this.onStop();
      this.active = false;
    }
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

const targetMap = new Map();
export function track(target: Object, key: string) {
  // target => key => dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target: Object, key: string) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect: any;
export function effect(fn: Function, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // options
  // extend
  extend(_effect, options);
  _effect.run();
  let runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}
