import { reactive } from '@vue/reactivity';
import { type HiRequestArgument, isHiRequestArgument } from 'hi-http'
import { type HiInputElOption, type HiInputOptionTuple, type MoreOptionConfig, defineHiInputConfig } from './defineHiInputConfig';
import { type HiSelectElOption, type HiSelectOption, defineHiSelectConfig } from './defineHiSelectConfig';
import { type DateFormatConfig, type HiDateElOption, type HiDateOption, defineHiDateConfig } from './defineHiDateConfig';
import { type DatePickType } from 'element-plus';

import { isBoolean, isUndefined, isString, isStrictObject } from 'hi-datatype-operation';
import { createObjTypeGuard, createUnionTypeGuard } from 'hi-guardian';

type ComputedConfigType = 'add' | 'sub' | 'mul' | 'div' | 'request' | 'filter' | 'switch' | 'from';
const isComputedConfigType = createUnionTypeGuard<ComputedConfigType>([
  (val): val is 'add' => val === 'add',
  (val): val is 'sub' => val === 'sub',
  (val): val is 'mul' => val === 'mul',
  (val): val is 'div' => val === 'div',
  (val): val is 'request' => val === 'request',
  (val): val is 'filter' => val === 'filter',
  (val): val is 'switch' => val === 'switch',
  (val): val is 'from' => val === 'from',
])
export interface ComputedConfig<T> {
  method: ComputedConfigType; // 计算方法
  keys?: string[]; // 关联字段
  args?: HiRequestArgument<T>, // 请求参数
  from_key?: string; // 计算结果字段
  options?: {
    [key: string]: string; // 选项
  },
}
export const isComputedConfig = createObjTypeGuard<ComputedConfig<any>>({
  method: isComputedConfigType,
  keys: (val): val is string[] | undefined => Array.isArray(val),
  args: (val): val is HiRequestArgument<any> | undefined => isHiRequestArgument(val) || isUndefined(val),
  from_key: (val): val is string | undefined => isString(val) || isUndefined(val),
  options: (val): val is { [key: string]: string } | undefined => isStrictObject(val) || isUndefined(val),
  // from: (val): val is string | undefined => isString(val) || isUndefined(val),
})
export interface DefaultValueConfig {
  computed_config?: ComputedConfig<any>, // 计算配置
  from?: string, // 引用来源
  default_select_all?: boolean, // Select 默认全选
  use_select_option?: boolean, // 使用 Select 选项
}
export const isDefaultValueConfig = createObjTypeGuard<DefaultValueConfig>({
  use_select_option: (val): val is boolean | undefined => isBoolean(val) || isUndefined(val),
  default_select_all: (val): val is boolean | undefined => isBoolean(val) || isUndefined(val),
  from: (val): val is string | undefined => isString(val) || isUndefined(val),
  computed_config: (val): val is ComputedConfig<any> | undefined => isComputedConfig(val) || isUndefined(val),
})
export interface VisibleConfig {
  key: string, // 关联字段
  value: string | number | boolean, // 关联值
  be_equal: string | boolean // 是否相等
}
export type HiFormElTag = 'input' | 'select' | 'checkbox' | 'radio' | 'switch' | 'date'
export type HiFormItemConfigOption = string | boolean | number | VisibleConfig | MoreOptionConfig | DatePickType | DateFormatConfig
export type FormElementOption = HiInputElOption | HiSelectElOption | HiDateElOption
export type FormItemOption = HiInputOptionTuple | HiSelectOption | HiDateOption
export type HiFormItemConfigOptions<T extends FormItemOption> = [
  index: number, // 序号
  label: string, // 标签
  name: string, // 字段名
  ...T, // 其他配置
]
/** 输入结构 */
export type HiFormItemsConfig = {
  [key in HiFormElTag]?: HiFormItemConfigOptions<FormItemOption>[]
};

// type: string, // 类型
// export type HiFormItemsConfigTuple = [
//   tag: HiFormElTag,
//   label: string, // 标签
//   name: string, // 字段名
//   type: string, // 类型
//   ...HiFormItemConfigOption[], // 其他配置
// ]

/** 输出结构 */
export interface HiFormItemOption<T> {
  tag?: HiFormElTag,
  label?: string, // 标签
  name?: string, // 字段名
  span?: number, // 栅格数
  formrequired?: boolean, // 是否必填
  placeholder?: string, // 占位符
  readonly?: boolean, // 是否只读
  formrequired_config?: any
  default_value_config?: DefaultValueConfig, // 默认值配置
  elConfig: T, // 表单元素配置
  onVisible?: (data?: Record<string, any>) => boolean; // 是否显示
}
export interface HiFormConfig<T> {
  // 基础布局配置
  inline?: boolean;            // 是否行内表单（表单元素在同一行显示）
  showSearchBtn?: boolean;     // 是否显示搜索按钮（默认显示）
  // 表单结构配置
  items: HiFormItemOption<FormElementOption>[] // 表单项配置
  // 表单数据与行为
  formData?: T; // 初始表单数据（可用于回填）
  searchBtnText?: string // 查询按钮文本（默认："查询"）
  labelWidth: number // 标签宽度（单位：px，默认：100）
  defaultSpan: number // 默认栅格数（默认：4，即占%宽度）
  // 回调函数
  onSubmit?: (data: T) => void; // 表单提交回调函数
  onReset?: () => void;        // 表单重置回调函数
  // 行为控制
  reFetch?: boolean;          // 提交后是否重新获取表格数据（默认：true）
  resetOnSubmit?: boolean;    // 提交后是否重置表单（默认：false）
  debounceTime?: number;      // 防抖时间（ms，默认：300，用于输入框实时搜索）
}

/**
 * author: 杜朝辉
 * date: 2025-02-19
 * description: 表单项配置
 * @param config 表单项配置JSON文件
 * @returns [HiFormItemOption[], Record<string, any>] 表单项配置和表单数据
 */
export const defineHiFormItems = (
  config: HiFormItemsConfig
): [Record<string, any>, HiFormItemOption<FormElementOption>[]] => {
  const formItems: HiFormItemOption<FormElementOption>[] = []
  const formData = {}
  Object.entries(config).forEach(([tag, items]: [string, Array<HiFormItemConfigOptions<FormItemOption>>]) => {
    items.forEach((item: HiFormItemConfigOptions<FormItemOption>) => {
      const [index, label, name, ...rest] = item
      // 初始化 formData
      Reflect.set(formData, name, undefined)
      // 初始化 formItems
      Reflect.set(formItems, index, {
        tag,
        label,
        name
      })
      // 设置默认值
      const setDefaultValue = (value: any) => {
        Reflect.set(formData, name, value)
      }
      switch (tag) {
        case 'input':
          Object.assign(formItems[index], defineHiInputConfig(rest as unknown as HiInputOptionTuple, setDefaultValue))
          break
        case 'select':
          Object.assign(formItems[index], defineHiSelectConfig(rest as unknown as HiSelectOption, setDefaultValue))
          break
        case 'date':
          Object.assign(formItems[index], defineHiDateConfig(rest as unknown as HiDateOption, setDefaultValue))
          break
      }
    })
  })
  return [reactive(formData), reactive(formItems)]
}
