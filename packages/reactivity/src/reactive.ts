import { track, trigger } from './effect';

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target: Object, key: string, receiver) {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set(target: Object, key: string, value, receiver) {
      const res = Reflect.set(target, key, value);
      trigger(target, key);
      return res;
    },
  });
}
