import { reactive, Ref, ref, watch } from "@vue/runtime-core"
import { defineHiTableColConfig, HiTableColElOptions, type HiTableColOptions } from "./defineHiTableColConfig"
import { getFieldValueByPath } from "hi-utils-pro"
import { defineHiFormItems, FormElementOption, HiFormItemOption } from "./defineHiFormItems"
import { type HiRequestArgument } from "hi-http"

export interface HiFormConfig {
  inline: boolean // 是否行内表单
  defaultLength: number // 默认表单项长度
  defaultSpan: number // 默认表单项跨度
  items: HiFormItemOption<FormElementOption>[] // 表单项
  formData: Record<string, any> // 表单数据
  showSearchBtn: boolean // 是否显示搜索按钮
  reFetch: boolean // 是否重新请求
  onSubmit: (data: Record<string, any>, searchResult?: any) => void // 提交回调
}

export interface HiTableColConfig {
  args?: HiRequestArgument<any> | null // 请求参数
  default?: HiTableColElOptions[] | null // 默认值
}
export interface HiTableDataConfig {
  args?: HiRequestArgument<any> | null // 请求参数
  default?: () => Ref<Record<string, any>[]> | null // 默认值
  from?: string // 数据来源
}
export interface HiTableActionsConfig {
  items: any[] // 操作按钮
  container_id?: string // 容器ID
  items_space?: number // 操作按钮间距
}
export interface HiTableConfig {
  name: string // 表格名称
  label: string // 表格标题
  sub_label: string // 表格副标题
  moduleId: string // 模块ID 用于请求服务端 colummns
  rowKey: string // 表格行key
  selected_data_model: string // 选中数据模型
  hide_selection_col: boolean // 是否隐藏选择列
  hide_index_col: boolean // 是否隐藏索引列
  title: string // 表格标题
  tableHeight: string // 表格高度
  tableWidth: string // 表格宽度
  minHeight: string // 表格最小高度
  searchFormConfig: HiFormConfig // 搜索表单配置
  columns_config: HiTableColConfig // 列配置
  data_config: HiTableColConfig // 数据配置
  chart_config?: any // 图表配置
  sorte_config?: any // 排序配置
  pagination_config?: any // 分页配置
  actions_config?: HiTableActionsConfig // 操作按钮配置
}

export function defineHiTableConfig(
  config: any,
  tableDataParam: any,
  page_states: any,
  page_state: any,
  doRequest: any
) {
  const result = reactive<any>({})
  const {
    moduleId = '',
    get_columns_url = '',
    rowKey,
    selected_data_model = 'multiple',
    table_columns,
    table_columns_config,
    table_data_fetch_args,
    table_data,
    table_data_fetch_args_url,
    table_data_from,
    hide_selection_col,
    hide_index_col,
    pagination_config,
    table_actions_config,
    table_search_form_config,
    title,
    chart_config,
    tableHeight,
    tableWidth,
    name,
    label,
    sub_label,
    sorte_config,
    minHeight
  } = config
  const columns = ref<HiTableColElOptions[]>([])
  if (table_columns) {
    columns.value = defineHiTableColConfig(table_columns, page_state, page_states)
  }
  if (table_columns_config) {
    const { items, dynamic_columns_config, default_columns } = table_columns_config
    if (items) {
      // <HiTableColumn>
      columns.value = defineHiTableColConfig(items, page_state, page_states)
    }
    /**
     * 配置动态 table 列
     */
    if (dynamic_columns_config) {
      watch(
        page_states,
        (page_states) => {
          const { from, num_format, column_align, column_width, prop_key_name, label_key_name } =
            dynamic_columns_config
          const res = getFieldValueByPath(from, page_states)
          if (res) {
            columns.value = res.map((item: any) => {
              const col_item: any = {
                prop: typeof item === 'string' ? item : Reflect.get(item, prop_key_name),
                label: typeof item === 'string' ? item : Reflect.get(item, label_key_name),
                minWidth: column_width,
                align: column_align
              }
              if (num_format) {
                col_item.numFormat = num_format
              }
              return col_item
            })
            if (default_columns) {
              // <HiTableColumn>
              columns.value = defineHiTableColConfig(default_columns, page_state).concat(
                columns.value
              )
            }
          }
        },
        { deep: true }
      )
    }
  }
  if (table_search_form_config) {
    const [searchFormData, searchFormItems]: any =
      table_search_form_config?.items || []
        ? defineHiFormItems(table_search_form_config?.items || [])
        : []
    Object.assign(tableDataParam, searchFormData)
    Object.assign(result, {
      searchFormConfig: {
        inline: true,
        defaultLength: table_search_form_config?.defaultLength,
        defaultSpan: 5,
        items: searchFormItems,
        formData: searchFormData,
        showSearchBtn: true,
        reFetch: true,
        async onSubmit(data: Record<string, any>, searchResult?: any) {
          if (table_search_form_config?.on_search_cb_config) {
            const { set_formdata_key_name, set_formdata_key_value } =
              table_search_form_config?.on_search_cb_config
            Reflect.set(data, set_formdata_key_name, set_formdata_key_value)
          }
          Object.assign(tableDataParam, data)
          if (Reflect.has(page_state, 'fetchTableDataParam')) {
            Object.assign(page_state, { fetchTableDataParam: { ...data } })
          }
          if (table_search_form_config.args) {
            doRequest(table_search_form_config.args, data)
          }
          if (table_search_form_config.args_list) {
            const res_list = Promise.all(
              table_search_form_config.args_list.map((args: any) => doRequest(args, data))
            )
          }
        }
      }
    })
  }
  if (table_data_fetch_args && table_data_fetch_args[1]) {
    Object.assign(tableDataParam, table_data_fetch_args[1])
  }
  table_data_fetch_args && void (table_data_fetch_args[1] = tableDataParam)
  Object.assign(result, {
    name,
    label,
    sub_label,
    moduleId,
    rowKey,
    selected_data_model,
    hide_selection_col,
    hide_index_col,
    title,
    tableHeight,
    tableWidth,
    minHeight,
    columns_config: {
      args: get_columns_url
        ? [get_columns_url]
        : (table_columns_config && table_columns_config.table_columns_fetch_args) || null,
      default: columns || null
    },
    data_config: {
      args: table_data_fetch_args_url
        ? [table_data_fetch_args_url, tableDataParam]
        : table_data_fetch_args,
      default: table_data ? () => ref(table_data) : null,
      from: table_data_from
    },
    chart_config,
    sorte_config
  })
  if (pagination_config) {
    result.pagination_config = pagination_config
  }
  if (table_actions_config) {
    result.actions = table_actions_config.items
    result.actions_container_id = table_actions_config?.container_id
    result.actions_items_space = table_actions_config?.items_space
  }
  return result
}