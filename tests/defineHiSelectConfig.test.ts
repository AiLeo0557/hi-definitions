declare const global: typeof globalThis
import { describe, expect, beforeAll, it } from 'vitest'
import {
  defineEnumOptions,
  defineHiDateConfig,
  defineHiFormItems,
  defineHiInputConfig,
  defineHiSelectConfig,
} from '../dist/index.js'

describe('defineHiSelectConfig', () => {
  it('case 1: enum_type', () => {
    const configs = defineHiSelectConfig(['MARKET_ID'])
    expect(configs).toEqual({
      span: 24,
      elConfig: {
        options_config: {
          alias: ['enumValue', 'enumCode'],
          args: [
            'http://localhost:8080/enum/v1/queryFsApdEnums',
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
          defaultOptions: [
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