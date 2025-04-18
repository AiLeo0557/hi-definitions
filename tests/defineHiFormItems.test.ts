import { describe, expect, beforeAll, it } from 'vitest'
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'

describe('defineHiFormItems', () => {
  it('case 1: DateFormItem', () => {
    const config = defineHiFormItems({
      date: [
        [
          0,
          '月份',
          'dataMonth',
          'month',
          ['YYYY-MM', 'YYYYMM'],
          ['202501', '202503'],
          {
            offset_amount: 1,
            offset_unit: 'month'
          },
          {
            key: 'date_type',
            value: '1',
            be_equal: '1'
          },
          12,
          true
        ]
      ],
      input: [
        [
          1,
          '金额',
          'dataAmount',
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
        ]
      ]
    })
    expect(config).toStrictEqual([
      { dataMonth: '202503', dataAmount: 100 },
      [
        {
          tag: 'date',
          label: '月份',
          name: 'dataMonth',
          span: 12,
          formrequired: true,
          elConfig: expect.objectContaining({ type: 'month', format: 'YYYY-MM', valueFormat: 'YYYYMM' }),
          onVisible: expect.any(Function),
        },
        {
          tag: 'input',
          label: '金额',
          name: 'dataAmount',
          span: 12,
          formrequired: true,
          elConfig: expect.objectContaining({ type: 'number', append: '元', disabled: false }),
          onVisible: expect.any(Function),
        }
      ]
    ])
  })
})