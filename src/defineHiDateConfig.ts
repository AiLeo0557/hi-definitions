import { HiFormItemOption, VisibleConfig } from "./defineHiFormItems"
import { createObjTypeGuard, createTupleTypeGuard, createUnionTypeGuard } from "hi-guardian";
import dayjs, { ManipulateType } from "dayjs";
import type { DatePickType } from 'element-plus'
import { isNull, isNumber, isString, isStrictObject, isUndefined, isBoolean } from 'hi-datatype-operation';

type disabled_date_st = [start?: string, end?: string]
type offset_range = [start: number, end: number]
const isOffsetRange = createTupleTypeGuard<offset_range>([isNumber, isNumber])
interface DefaultDateValueConfig {
  offset_amount: number | offset_range,
  offset_unit: ManipulateType,
}
export type DateFormatConfig = [format: string | null, value_format: string | null]
const isManipulateType = createUnionTypeGuard<ManipulateType>([
  (val): val is 'millisecond' => val === 'millisecond',
  (val): val is 'second' => val === 'second',
  (val): val is 'minute' => val === 'minute',
  (val): val is 'hour' => val === 'hour',
  (val): val is 'day' => val === 'day',
  (val): val is 'month' => val === 'month',
  (val): val is 'year' => val === 'year',
  (val): val is 'milliseconds' => val === 'milliseconds',
  (val): val is 'seconds' => val === 'seconds',
  (val): val is 'minutes' => val === 'minutes',
  (val): val is 'hours' => val === 'hours',
  (val): val is 'days' => val === 'days',
  (val): val is 'months' => val === 'months',
  (val): val is 'years' => val === 'years',
  (val): val is 'd' => val === 'd',
  (val): val is 'D' => val === 'D',
  (val): val is 'M' => val === 'M',
  (val): val is 'y' => val === 'y',
  (val): val is 'h' => val === 'h',
  (val): val is 'm' => val === 'm',
  (val): val is 's' => val === 's',
  (val): val is 'ms' => val === 'ms',
])
const isDatePickType = createUnionTypeGuard<DatePickType>([
  (val): val is 'year' => val === 'year',
  (val): val is 'month' => val === 'month',
  (val): val is 'date' => val === 'date',
  (val): val is 'dates' => val === 'dates',
  (val): val is 'week' => val === 'week',
  (val): val is 'datetime' => val === 'datetime',
  (val): val is 'datetimerange' => val === 'datetimerange',
  (val): val is 'daterange' => val === 'daterange',
  (val): val is 'monthrange' => val === 'monthrange',
  (val): val is 'yearrange' => val === 'yearrange',
])
export const isDateFormatConfig = createTupleTypeGuard<DateFormatConfig>([isString, isString])
export const isDefaultDateValueConfig = createObjTypeGuard<DefaultDateValueConfig>({
  offset_amount: isNumber || isOffsetRange,
  offset_unit: isManipulateType
})
export type HiDateOption = [
  type: DatePickType, // 类型
  format_config?: DateFormatConfig, // 格式
  disabled_config?: boolean | disabled_date_st | null, // 禁用配置
  default_value_config?: DefaultDateValueConfig | string | null, // 默认值配置
  visible_config?: VisibleConfig | null, // 是否显示
  span?: number | null, // 表单栅格
  required?: boolean | null, // 是否必填
]
export interface HiDateElOption {
  type: DatePickType, // 类型
  format?: string, // 格式
  valueFormat?: string, // 值格式
  multiple?: boolean,
  disabled?: boolean,
  disabledDateStartKey?: string,
  disabledDateEndKey?: string,
}
/**
 * author: 杜朝辉
 * date: 2025-02-20
 * description: Date 组件配置
 */
export function defineHiDateConfig(
  config_options: HiDateOption,
  setDefaultValue: (val: unknown) => void = (val) => { }
): HiFormItemOption<HiDateElOption> {
  const defaultConfig: HiFormItemOption<HiDateElOption> = {
    span: 24, // 栅格数
    elConfig: {
      type: 'date', // 类型
      format: undefined, // 格式
      valueFormat: undefined, // 值格式
    } // el组件配置
  }
  const [
    type,
    format_config,
    disabled_config,
    default_value_config,
    visible_config,
    span,
    required,
  ] = config_options
  // 设置 type
  if (isDatePickType(type)) defaultConfig.elConfig.type = type
  // 设置 format_config
  if (format_config) {
    const [format, value_format] = format_config
    if (isString(format)) defaultConfig.elConfig.format = format
    if (isString(value_format)) defaultConfig.elConfig.valueFormat = value_format
  }
  // 设置 disabled_config
  if (isBoolean(disabled_config) || isStrictObject(disabled_config)) {
    if (isBoolean(disabled_config)) {
      defaultConfig.elConfig.disabled = disabled_config
    }
    if (Array.isArray(disabled_config)) {
      const [disabledDateStartKey, disabledDateEndKey] = disabled_config
      if (disabledDateStartKey) defaultConfig.elConfig.disabledDateStartKey = disabledDateStartKey
      if (disabledDateEndKey) defaultConfig.elConfig.disabledDateEndKey = disabledDateEndKey
    }
  }
  // 设置 visible_config
  if (visible_config) {
    defaultConfig.onVisible = (data?: Record<string, any>): boolean => {
      const { key, value, be_equal } = visible_config!
      const compare_value = data![key]
      if (be_equal) {
        return compare_value === value
      }
      if (!be_equal) {
        return compare_value !== value
      }
      return false
    }
  }
  // 设置 default_value_config
  if (default_value_config && setDefaultValue) {
    let res
    if (isString(default_value_config)) {
      res = default_value_config
    }
    if (isDefaultDateValueConfig(default_value_config)) {
      const { offset_amount, offset_unit } = default_value_config
      const [, value_format] = format_config as DateFormatConfig
      if (type.includes('range') && !isNull(value_format)) {
        if (Array.isArray(offset_amount)) {
          res = [
            dayjs().subtract(offset_amount[0], offset_unit).format(value_format),
            dayjs().subtract(offset_amount[1], offset_unit).format(value_format),
          ]
        } else {
          res = [
            dayjs().subtract(offset_amount, offset_unit).format(value_format),
            dayjs().format(value_format),
          ]
        }
      }
      if (isNumber(offset_amount) && !isNull(value_format)) {
        res = dayjs().subtract(offset_amount, offset_unit).format(value_format)
      }
    }
    setDefaultValue(res)
  }
  // 设置 span
  if (!isNull(span) && !isUndefined(span)) defaultConfig.span = span as number
  // 设置 required
  if (isBoolean(required)) defaultConfig.formrequired = required as boolean
  return defaultConfig
}
