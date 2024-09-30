import { describe, it, expect, jest } from '@jest/globals'

function add(a: number, b: number) {
  return a + b
}

describe('add function', () => {
  it('should return the sum of two numbers', () => {
    const result = add(2, 3)
    expect(result).toBe(5)
  })

  it('should be called once', () => {
    const spyAdd = jest.fn(add)
    const result = spyAdd(2, 3)
    expect(result).toBe(5)
    expect(spyAdd).toHaveBeenCalledTimes(1)
  })
})
