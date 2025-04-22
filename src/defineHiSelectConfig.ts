import {
  isHiRequestArgument,
  type HiRequestArgument
} from "hi-http";
import {
  createArrayTypeGuard,
  createObjTypeGuard
} from 'hi-guardian'
import {
  isDefaultValueConfig,
  type DefaultValueConfig,
  type HiFormItemOption,
  type VisibleConfig
} from "./defineHiFormItems";
import { defineEnumOptions } from "./defineEnumOptions";
import {
  isNull,
  isString,
  isPrimitive,
  isNonNullablePrimitive,
  isUndefined,
  isBoolean,
  type NonNullablePrimitive,
  type Primitive
} from "hi-datatype-operation";


export interface HiSelectOptionItem {
  label: string,
  value: Primitive,
}
const isHiSelectionOptionItem = createObjTypeGuard<HiSelectOptionItem>({
  label: isString,
  value: isPrimitive,
});
const isHiSelectionOptionItems = createArrayTypeGuard<HiSelectOptionItem>(isHiSelectionOptionItem);

export type EnumOptionsAlias = [label: string, value: string];
export type HiSelectOption = [
  enum_type?: string | null, // 枚举值类型
  options_config?:
  HiRequestArgument<any> |
  HiSelectOptionItem[] |
  {
    args: HiRequestArgument<any>,
    default_value: HiSelectOptionItem[]
  } |
  null, // Options 请求参数
  alias?: string | null, // Options 别名
  multiple?: boolean | null, // 是否多选
  disabled?: boolean | null, // 是否禁用
  default_value?: NonNullablePrimitive | DefaultValueConfig | null, // 默认值
  visible_config?: VisibleConfig | null, // 是否显示
  span?: number | null, // 表单栅格
  required?: boolean | null, // 是否必填
]
export interface HiSelectOptionsConfig<T> {
  alias?: EnumOptionsAlias,
  args?: HiRequestArgument<T>,
  defaultOptions?: HiSelectOptionItem[],
}
export interface HiSelectElOption {
  multiple?: boolean,
  disabled?: boolean,
  options_config?: HiSelectOptionsConfig<any>,
}
/**
 * author: 杜朝辉
 * date: 2025-02-19
 * description: Select 组件配置
 */
export function defineHiSelectConfig(
  config_options: HiSelectOption,
  setDefaultValue: (val: unknown) => void = (val) => { }
): HiFormItemOption<HiSelectElOption> {
  const defaultConfig: HiFormItemOption<HiSelectElOption> = {
    span: 24, // 栅格数
    elConfig: {} // el组件配置
  }
  const [
    enum_type,
    options_config,
    alias,
    multiple,
    disabled,
    default_value,
    visible_config,
    span,
    required
  ] = config_options
  defaultConfig.elConfig = {}
  // 设置 enum_type
  if (enum_type) {
    defaultConfig.elConfig.options_config = defineEnumOptions(enum_type)
  }
  // 设置 options_config
  if (options_config) {
    if (Array.isArray(options_config)) {
      defaultConfig.elConfig!.options_config = {}
      // 配置 args
      if (isHiRequestArgument(options_config)) {
        defaultConfig.elConfig!.options_config!.args = options_config
        // 配置 default_value
      } else if (isHiSelectionOptionItems(options_config)) {
        defaultConfig.elConfig!.options_config!.defaultOptions = options_config
      }
    } else {
      const { args, default_value } = options_config
      if (isHiRequestArgument(args)) {
        defaultConfig.elConfig.options_config!.args = args
      }
      if (isHiSelectionOptionItems(default_value)) {
        defaultConfig.elConfig.options_config!.defaultOptions = default_value
      }
    }
  }
  // 设置 alias
  if (alias) {
    defaultConfig.elConfig.options_config!.alias = alias.split(',') as EnumOptionsAlias
  }
  // 设置 multiple
  if (isBoolean(multiple)) defaultConfig.elConfig.multiple = multiple as boolean
  // 设置 disabled
  if (isBoolean(disabled)) defaultConfig.elConfig.disabled = disabled as boolean
  // 设置 default_value
  if (!isUndefined(default_value) && !isNull(default_value)) {
    if (isNonNullablePrimitive(default_value)) {
      setDefaultValue(default_value)
    } else if (isDefaultValueConfig(default_value)) {
      defaultConfig.default_value_config = default_value
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
  // 设置 span
  if (!isNull(span) && !isUndefined(span)) defaultConfig.span = span as number
  // 设置 required
  if (isBoolean(required)) defaultConfig.formrequired = required as boolean
  return defaultConfig
}