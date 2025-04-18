import { describe, expect, beforeAll, it } from 'vitest'
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'

import type { HiDateOption } from '../dist/index.d'


describe('defineHiDateConfig', () => {
  it('case 1:', () => {
    /**
      type: DatePickType, // 类型
      format_config?: DateFormatConfig, // 格式
      disabled_config?: boolean | disabled_date_st | null, // 禁用配置
      default_value_config?: DefaultDateValueConfig | string | null, // 默认值配置
      visible_config?: VisibleConfig | null, // 是否显示
      span?: number | null, // 表单栅格
      required?: boolean | null, // 是否必填
     */
    let default_value = ''
    const config_tup: HiDateOption = [
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
    const config = defineHiDateConfig(config_tup, (res: any) => {
      default_value = res
    })
    expect(config).toEqual({
      span: 12,
      elConfig: { type: 'month', format: 'YYYY-MM', valueFormat: 'YYYYMM' },
      formrequired: true,
      onVisible: expect.any(Function),
    })
    expect(default_value).toEqual('202503')
  })
})