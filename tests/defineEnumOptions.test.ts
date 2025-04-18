declare const global: typeof globalThis
import { describe, expect, beforeAll, it } from 'vitest'
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'

describe('defineEnumOptions', () => {
  beforeAll(() => {
    // 创建 localStorage 的模拟实现
    global.localStorage = {
      length: 0,
      key(index: number) {
        return null
      },
      store: {},
      getItem(key: string) {
        return this.store[key]
      },
      setItem(key: string, value: string) {
        this.store[key] = value
      },
      removeItem(key: string) {
        delete this.store[key]
      },
      clear() {
        this.store = {}
      }
    }
  })
  it('case 1:', () => {
    localStorage.setItem('MARKET_ID', '1')
    const configs = defineEnumOptions('MARKET_ID')
    expect(configs).toEqual({
      alias: ['enumValue', 'enumCode'],
      args: [
        'http://localhost:8080/enum/v1/queryFsApdEnums',
        { codeType: 'MARKET_ID' },
        { res_key_name: 'res.resultValue.0.value' }
      ]
    })
  })
})
