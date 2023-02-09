import { test, expect, describe } from 'vitest'
import { effect, reactive } from '../src'

describe('effect', () => {
  test('effect', () => {
    const user = reactive({ age: 10 })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++
    expect(nextAge).toBe(12)
  })

  test('runner', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })
})
