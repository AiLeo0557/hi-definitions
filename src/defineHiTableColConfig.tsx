import { type FormItemOption, type HiFormElTag } from "./defineHiFormItems";
import { getFieldValueByPath, getFormatNum } from "hi-utils-pro";
// import { useDownload } from "@hi-block/http";
import { getDataType, isString, isArrayLike } from "hi-datatype-operation";
import { HiRequestArgument, useBusDownload } from "hi-http";
import { defineHiDateConfig, HiDateOptionTuple } from "./defineHiDateConfig";
import { Component } from "vue";
import { defineHiSelectConfig, HiSelectOptionTuple } from "./defineHiSelectConfig";

export type HiTableColFixedConfig = 'left' | 'right' | [fixed: 'left' | 'right', bgcolor: string]
export type HiTableColFormatConfigType = 'download' | 'downloads' | 'update' | 'preview' | 'icon' | 'folder' | 'highlight' | 'edit' | 'bold' | 'unit';
export interface HiTableColFormatConfig {
  type: HiTableColFormatConfigType // 格式化类型
  file_name?: string // 下载文件文件名
  file_suffix?: string // 下载文件后缀
  file_id?: string // 下载文件id
  dialog_config?: HiDialogConfig // 弹窗配置
  content_config?: ContentConfig // 内容配置
  placeholder?: string // 占位符
  flag_key?: string // 标记key
  flag_value?: string // 标记值
  min?: number // 高亮边界最小值
  max?: number // 高亮边界最大值
  unit_name?: string // 单位名称
  num_format?: number // 数字格式化
  form_tag?: string // 表单标签
  edit_type?: string // 编辑类型
  form_type?: HiFormElTag // 表单类型
  form_item_config?: FormItemOption // 表单项配置
  margin_left?: number // 左边距
}
export interface HiDialogConfig {
  title: string // 弹窗标题
  width: number // 弹窗宽度
  height: number // 弹窗高度
  hide_footer: boolean // 是否隐藏底部
  content?: () => Component // 弹窗包含内容
}
export interface ContentConfig {
  component_name: string // 组件名称
  props: Record<string, any> // 组件属性
}
// 输入
export type HiTableColOptionsTuple = [
  prop: string, // 列属性
  label: string, // 列名
  minWidth?: number, // 列宽
  align?: 'left' | 'center' | 'right', // 列对齐方式
  f_p?: number | string | HiTableColFormatConfig, // 列格式化配置
  sub_columns?: HiTableColOptionsTuple[], // 子列
  tip?: string, // 列提示
  sortable?: boolean, // 是否排序
  fixed_config?: HiTableColFixedConfig // 列固定配置
];
export type HiTableColConfig =
  HiTableColOptionsTuple[] |
  {
    args?: HiRequestArgument<any> // 请求参数
    default_items?: HiTableColOptionsTuple[] // 默认值
    items?: HiTableColOptionsTuple[] // 数据来源
    from?: string // 数据来源
    prop_key_name?: string
    label_key_name?: string
    column_width?: number
    column_align?: string
    num_format?: number
  }

/**
 * author: 杜朝辉
 * date: 2025-02-21
 * description: 生成HiTable列配置
 */
export function defineHiTableColConfig(
  columns_data: HiTableColOptionsTuple[],
  page_state?: Record<string, any>,
  page_states?: Record<string, any>
): HiTableColElOptions[] {
  return columns_data.map((row: HiTableColOptionsTuple): HiTableColElOptions => {
    const [prop, label, minWidth, align, f_p, sub_columns, tip, sortable, fixed_config] = row;
    const column_row: HiTableColElOptions = {
      prop, label, minWidth, align, tip, sortable
    }
    const format_type = getDataType(f_p)
    switch (format_type) {
      case 'number':
        column_row.num_format = f_p as number;
        break
      case 'string':
        column_row.default = ({ row }: any) => Reflect.get(row, prop) || f_p;
        break
      case 'object':
        defineFormatConfig(f_p as HiTableColFormatConfig, column_row)
        break
    }
    if (sub_columns) {
      column_row.sub_columns = defineHiTableColConfig(sub_columns);
    }
    if (fixed_config && isString(fixed_config)) {

    }
    if (fixed_config && isArrayLike(fixed_config)) {
      const [_align, color] = fixed_config
      column_row.fixed_config = {
        align: _align as 'left' | 'right',
        color
      }
    }
    return column_row
  })
}
export function defineFormatConfig(f_p: HiTableColFormatConfig, column_row: HiTableColElOptions) {
  const {
    type,
    file_name,
    file_suffix,
    file_id,
    placeholder,
    dialog_config,
    content_config,
    flag_key,
    flag_value,
    min,
    max,
    num_format,
    unit_name,
    edit_type,
    form_tag,
    form_type,
    form_item_config,
    margin_left
  } = f_p
  switch (type) {
    case 'download':
      column_row.default = ({ row }: Record<string, any>) => {
        let parse_id = getFieldValueByPath(file_id as string, { row })
        let parse_name = getFieldValueByPath(file_name as string, { row })
        const handdleClick = (e: MouseEvent) => {
          e.preventDefault()
          useBusDownload(parse_id, parse_name, file_suffix)
        }
        if (!parse_name || parse_name === 'null') {
          return placeholder
        }
        return <el-link onClick={handdleClick} > {parse_name || '下载'}</el-link>
      }
      break
    case 'downloads':
      column_row.default = ({ row }: any) => {
        return row[column_row.prop]
          ? row[column_row.prop].map((file: any, index: number) => {
            if (file_name.includes('{{') && file_name.includes('}}')) {
              const parse_id = file_id.replace(/{{(.*?)}}/g, (_: any, param_key: string) =>
                Reflect.get(file, param_key)
              )
              const parse_name = file_name.replace(/{{(.*?)}}/g, (_: any, param_key: string) =>
                Reflect.get(file, param_key)
              )
              const handdleClick = (e: MouseEvent) => {
                e.preventDefault()
                useBusDownload(parse_id, parse_name)
              }
              if (!parse_name || parse_name === 'null') {
                return placeholder
              }
              return index % 2 === 1 ? (
                <>
                  <span>,</span>
                  <el-link onClick={handdleClick}>{parse_name || '下载'}</el-link>
                </>
              ) : (
                <el-link onClick={handdleClick}>{parse_name || '下载'}</el-link>
              )
            }
          })
          : '------'
      }
      break
    case 'preview':
      column_row.default = ({ row }: any) => {
        return (
          <hi-preview
            row={row}
            prop={column_row.prop}
            dialog_config={dialog_config}
            content_config={content_config}
          />
        )
      }
      break;
    case 'highlight':
      column_row.default = ({ row }: any) => {
        let row_item_data = Reflect.get(row, column_row.prop)
        if (min || max) {
          const min_val = Reflect.has(row, min) ? Reflect.get(row, min) : min
          const max_val = Reflect.has(row, max) ? Reflect.get(row, max) : max
          const canbe_highlight = row_item_data < min_val || row_item_data > max_val
          if (canbe_highlight) {
            row_item_data = num_format ? getFormatNum(row_item_data, num_format) : row_item_data
            return <b style="color:#fefb00">{row_item_data}</b>
          }
        }
        if (flag_key) {
          const flag = Reflect.get(row, flag_key)
          row_item_data = num_format ? getFormatNum(row_item_data, num_format) : row_item_data
          if (flag === flag_value) {
            return <b style="color:#fefb00">{row_item_data}</b>
          }
        }
        return row_item_data
      }
      break
    case 'unit':
      column_row.default = ({ row }: any) => {
        let row_item_data = Reflect.get(row, column_row.prop)
        if (num_format !== undefined) {
          row_item_data = getFormatNum(row_item_data, num_format)
        }
        return row_item_data + unit_name
      }
      break
    case 'edit':
      column_row.default = ({ row }: any) => {
        let row_item_data = Reflect.get(row, column_row.prop)
        row_item_data = num_format ? getFormatNum(row_item_data, num_format) : row_item_data
        if (
          (row.editable && edit_type.includes('edit')) ||
          (row.addable && edit_type.includes('add'))
        ) {
          if (form_tag === 'input') {
            return <hi-input formData={row} v-model={row[column_row.prop]} name={column_row.prop} type={form_type} />
          }
          if (form_tag === 'date') {
            const options = defineHiDateConfig(form_item_config as HiDateOptionTuple)
            return <hi-date formData={row} v-model={row[column_row.prop]} name={column_row.prop} {...options} />
          }
          if (form_tag === 'select') {
            const options = defineHiSelectConfig(form_item_config as HiSelectOptionTuple)
            return <hi-select formData={row} v-model={row[column_row.prop]} name={column_row.prop} {...options} />
          }
        }
        return row_item_data
      }
      break
    case 'bold':
      column_row.default = ({ row }: any) => {
        let row_item_data = Reflect.get(row, column_row.prop)
        if (flag_key) {
          const flag = Reflect.get(row, flag_key)
          row_item_data = num_format ? getFormatNum(row_item_data, num_format) : row_item_data
          if (flag === flag_value) {
            return <b style="font-weight: bold;font-size: 15px">{row_item_data}</b>
          } else if (margin_left && flag === '3') {
            return <span style="margin-left: 28px">{row_item_data}</span>
          } else if (margin_left) {
            return <span style="margin-left: 14px">{row_item_data}</span>
          }
        }
        return row_item_data
      }
      break
  }
}
// 输出
export interface HiTableColElOptions {
  prop: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  tip?: string;
  sortable?: boolean;
  num_format?: number;
  default?: (data: any) => any; // JSX.Element
  sub_columns?: HiTableColElOptions[];
  fixed_config?: { // 列固定配置
    align: 'left' | 'right'
    color?: string
  }
}
/**
 * on_url?: string 打开接口
 * off_url?: string 关闭接口
 * if_statement?: boolean 
 * active_icon?: string
 * normal_icon?: string
 if (type === 'icon') {
    column.default = ({ row }: any) => {
      const handdleClick = async (url: string) => {
        if (url.includes('{{') && url.includes('}}')) {
          url = url.replace(/{{(.*?)}}/g, (_: any, _key: string) => Reflect.get(row, _key))
        }
        const res = await useBusPost(url, {})
        if (Reflect.has(page_state, 'update_flag')) {
          Reflect.set(page_state, 'update_flag', Math.random())
        }
      }
      if (if_statement) {
        const checkSatus = new Function('row', if_statement)
        if (checkSatus(row)) {
          return (
            <el-link
              style="color:#e6a23c;font-size:18px;"
              icon={active_icon}
              onClick={handdleClick.bind(null, off_url)}
            />
          )
        }
      }
      return (
        <el-link
          style="color:#e6a23c;font-size:18px;"
          icon={normal_icon}
          onClick={handdleClick.bind(null, on_url)}
        />
      )
    }
  }
 */
/**
 * content?: string // 默认展示的内容
 if (type === 'update') {
    const store = usePageStore()
    column.default = ({ row }: any) => {
      const handleCurrentRowData = () => {
        store.setMainTableSelectedRowData(row)
        if (f_p.sub_table_index) {
          store.setHiddenSubTableIndex(f_p.sub_table_index)
        }
      }
      if (content) {
        return <el-link onClick={handleCurrentRowData}>{content}</el-link>
      }
    }
  }
 */
