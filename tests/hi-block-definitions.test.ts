declare const global: typeof globalThis
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'
import type { HiDateOption } from '../dist/index.d.cts'

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
        'engine-bill/combox/queryFsApdEnums',
        { codeType: 'MARKET_ID' },
        { res_key_name: 'res.resultValue.0.value' }
      ]
    })
  })
})
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
    expect(default_value).toEqual('202502')
  })
})
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
describe('defineHiSelectConfig', () => {
  it('case 1: enum_type', () => {
    const configs = defineHiSelectConfig(['MARKET_ID'])
    expect(configs).toEqual({
      span: 24,
      elConfig: {
        options_config: {
          alias: ['enumValue', 'enumCode'],
          args: [
            'engine-bill/combox/queryFsApdEnums',
            { codeType: 'MARKET_ID' },
            { res_key_name: 'res.resultValue.0.value' }
          ]
        }
      }
    })
  })
  it('case 2: options_config/isHiRequestArgument', () => {
    const config = defineHiSelectConfig([
      ,
      [
        'engine-bill/combobox/getplantlist',
        { participantType: '03' }
      ],
      'text,value',
      true,
      ,
      'PXTCM',
      null,
      12,
      true
    ])
    console.log(145, config)
    expect(config).toEqual({
      span: 12,
      elConfig: {
        options_config: {
          alias: ['text', 'value'],
          args: [
            'engine-bill/combobox/getplantlist',
            { participantType: '03' }
          ]
        },
        multiple: true,
      },
      formrequired: true,
    })
  })
  it('case 3: options_config/isHiSelectionOptionItems', () => {
    /**
    type,
    options_config,
    alias,
    multiple,
    disabled,
    default_value,
    visible_config,
    span,
    required
     */
    const config = defineHiSelectConfig([
      , // type
      [
        {
          label: '发电企业',
          value: '01',
        },
        {
          label: '售电企业',
          value: '02',
        },
        {
          label: '电网企业',
          value: '03',
        },
        {
          label: '其他企业',
          value: '04',
        }
      ], // default_options
      , // alias
      true, // multiple
      , // disabled
      '01', // default_value
      , // visible_config
      12, // span
      true // required
    ])
    expect(config).toEqual({
      span: 12,
      elConfig: {
        options_config: {
          defaultValue: [
            {
              label: '发电企业',
              value: '01',
            },
            {
              label: '售电企业',
              value: '02',
            },
            {
              label: '电网企业',
              value: '03',
            },
            {
              label: '其他企业',
              value: '04',
            }
          ]
        },
        multiple: true,
      },
      formrequired: true,
    })
  })
})
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
      { dataMonth: '202502', dataAmount: 100 },
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
