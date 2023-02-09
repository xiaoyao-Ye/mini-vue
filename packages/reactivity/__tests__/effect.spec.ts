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
})
