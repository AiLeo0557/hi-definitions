import { describe, expect, beforeAll, it } from 'vitest'
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'

describe('defineHiInputConfig', () => {
  it('case 1: default_value is number', () => {
    const config = defineHiInputConfig([
      'number',
      '元',
      false,
      100,
      true,
      {
        key: 'date_type',
        value: '1',
        be_equal: '1'
      },
      12
    ])
    expect(config).toEqual(
      expect.objectContaining({
        span: 12,
        elConfig: { type: 'number', append: '元', disabled: false },
        formrequired: true,
        onVisible: expect.any(Function),
      })
    )
  })
})