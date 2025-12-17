import { reactive, Ref, ref, watch } from "@vue/runtime-core"
import { defineHiTableColConfig, HiTableColConfig, HiTableColElOptions, type HiTableColOptionsTuple } from "./defineHiTableColConfig"
import { getFieldValueByPath } from "hi-utils-pro"
import { type HiRequestArgument } from "hi-http"
import { Primitive } from "hi-datatype-operation"
import { HiTableActionsConfig } from "./defineHiTableActionsConfig"

export type HiTableDataConfig =
  HiRequestArgument<any> |
  Ref<Record<string, Primitive>[]> |
  {
    args?: HiRequestArgument<any> // 请求参数
    default?: Ref<Record<string, Primitive>[]> // 默认值
    from?: string // 数据来源
  }

// layout?: 'row' | 'col' // 子表的布局
type HiTablePaginationConfig = {
  pagination_hidden?: boolean // 分页器Container隐藏
  hidden?: boolean // 分页器隐藏
  current_name?: string // 分页参数名称
  size_name?: string // 分页个数参数名称
  size?: number | Ref<number> // 分页个数
  sizes?: number[] | Ref<number[]> // 分页器可选个数
  current?: number | Ref<number> // 当前页码
} | [
  pagination_hidden?: boolean, // 分页器Container隐藏
  hidden?: boolean, // 分页器隐藏
  current_name?: string, // 分页参数名称
  size_name?: string, // 分页个数参数名称
  size?: number | Ref<number>, // 分页个数
  sizes?: number[] | Ref<number[]>, // 分页器可选个数
  current?: number | Ref<number>, // 当前页码
]
export interface HiTableConfig {
  name?: string // 表格名称
  label?: string // 表格标题
  sub_label?: string // 表格副标题
  rowKey?: string // 表格行key

  // 数据配置
  data_config: HiTableDataConfig // 数据配置

  // 操作按钮配置
  actions_config?: HiTableActionsConfig // 操作按钮配置

  // 表格配置
  tableHeight?: number // 表格高度
  tableWidth?: string // 表格宽度 默认 100%
  minHeight?: string // 表格最小高度
  selection_col_type?: 'radio' | 'checkbox' // 选中数据模型
  hide_selection_col?: boolean // 是否隐藏选择列
  hide_index_col?: boolean // 是否隐藏索引列

  // 列配置
  moduleId?: string // 模块ID 用于请求服务端 colummns
  get_columns_url?: string // 获取列配置的url
  columns_config: HiTableColConfig // 列配置

  // 分页配置
  pagination_config?: HiTablePaginationConfig
}

// chart_config?: any // 图表配置
// sorte_config ?: any // 排序配置
export function defineHiTableConfig(
  config: HiTableConfig,
  tableDataParam: any,
  page_states: any,
  page_state: any,
  doRequest: any
): HiTableElOptions {
  const result = reactive<HiTableElOptions>({})
  const {
    moduleId = '',
    get_columns_url = '',
    rowKey,
    selection_col_type = 'checkbox',
    columns_config,
    data_config,
    hide_selection_col,
    hide_index_col,
    pagination_config,
    tableHeight,
    tableWidth,
    name,
    label,
    sub_label,
    minHeight
  } = config
  const columns = ref<HiTableColElOptions[]>([])
  // if (columns_config.default) {
  //   columns.value = defineHiTableColConfig(columns_config.default, page_state, page_states)
  // }
  if (columns_config) {
    const {
      items,
      from,
      default_items,
      prop_key_name,
      label_key_name,
      column_width,
      column_align,
      num_format,
    } = columns_config
    if (items) {
      columns.value = defineHiTableColConfig(items, page_state, page_states)
    }
    /**
     * 配置动态 table 列
     */
    if (from) {
      watch(
        page_states,
        (page_states) => {
          // const { from, num_format, column_align, column_width, prop_key_name, label_key_name } =
          //   dynamic_columns_config
          const res = getFieldValueByPath(from, page_states)
          if (res) {
            columns.value = res.map((item: any) => {
              const col_item: any = {
                prop: typeof item === 'string' ? item : Reflect.get(item, prop_key_name),
                label: typeof item === 'string' ? item : Reflect.get(item, label_key_name),
                minWidth: column_width,
                align: column_align
              }
              if (num_format !== undefined) {
                col_item.numFormat = num_format
              }
              return col_item
            })
            if (default_items) {
              columns.value = defineHiTableColConfig(default_items, page_state).concat(
                columns.value
              )
            }
          }
        },
        { deep: true }
      )
    }
  }
  if (data_config.args && data_config.args[1]) {
    Object.assign(tableDataParam, data_config.args[1])
  }
  data_config.args && void (data_config.args[1] = tableDataParam)
  Object.assign(result, {
    name,
    label,
    sub_label,
    moduleId,
    rowKey,
    selection_col_type,
    hide_selection_col,
    hide_index_col,
    tableHeight,
    tableWidth,
    minHeight,
    columns,
    // columns_config: {
    //   args: get_columns_url
    //     ? [get_columns_url]
    //     : (table_columns_config && table_columns_config.table_columns_fetch_args) || null,
    //   default: columns || null
    // },
    // data_config: {
    //   args: table_data_fetch_args_url
    //     ? [table_data_fetch_args_url, tableDataParam]
    //     : table_data_fetch_args,
    //   default: table_data ? () => ref(table_data) : null,
    //   from: table_data_from
    // },
    // sorte_config
  })
  // if (pagination_config) {
  //   result.pagination_config = pagination_config
  // }
  // if (table_actions_config) {
  //   result.actions = table_actions_config.items
  //   result.actions_container_id = table_actions_config?.container_id
  //   result.actions_items_space = table_actions_config?.items_space
  // }
  return result
}
export interface HiTableElOptions {
  name?: string
  label?: string
  sub_label?: string
  moduleId?: string
  rowKey?: string
  selection_col_type?: 'radio' | 'checkbox'
  hide_selection_col?: boolean
  hide_index_col?: boolean
  tableHeight?: number
  tableWidth?: number
  minHeight?: number
  columns?: HiTableColElOptions[]
}
