import { type FormElementOption, type HiFormElTag } from "./defineHiFormItems";
import { getFieldValueByPath } from "hi-utils-pro";
// import { useDownload } from "@hi-block/http";
import { getDataType } from "hi-datatype-operation";

/**
 * author: 杜朝辉
 * date: 2025-02-21
 * description: 生成HiTable列配置
 */
export function defineHiTableColConfig(
  columns_data: HiTableColOptions[],
  page_state?: Record<string, any>,
  page_states?: Record<string, any>
) {
  return columns_data.map((row: HiTableColOptions): HiTableColElOptions => {
    const [prop, label, minWidth, align, f_p, sub_columns, tip, sortable] = row;
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
    return column_row
  })
}
export function defineFormatConfig(f_p: HiTableColFormatConfig, column_row: HiTableColElOptions) {
  const {
    type,
    on_url,
    off_url,
    file_name,
    file_suffix,
    if_statement,
    active_icon,
    normal_icon,
    file_id,
    placeholder,
  } = f_p
  switch (type) {
    case 'download':
      column_row.default = ({ row }: Record<string, any>) => {
        let parse_id = getFieldValueByPath(file_id as string, { row })
        let parse_name = getFieldValueByPath(file_name as string, { row })
        const handdleClick = (e: MouseEvent) => {
          e.preventDefault()
          // useDownload(parse_id, parse_name, file_suffix)
        }
        if (!parse_name || parse_name === 'null') {
          return placeholder
        }
        return <el-link onClick={handdleClick} > {parse_name || '下载'}</el-link>
      }
      break
    case 'downloads':
      column_row.default = ({ row }: any) => {

      }
  }
}

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
}
export type HiTableColOptions = [
  prop: string, // 列属性
  label: string, // 列名
  minWidth?: number, // 列宽
  align?: 'left' | 'center' | 'right', // 列对齐方式
  f_p?: number | string | HiTableColFormatConfig, // 列格式化配置
  sub_columns?: HiTableColOptions[], // 子列
  tip?: string, // 列提示
  sortable?: boolean, // 是否排序
];
export type HiTableColFormatConfigType = 'download' | 'downloads' | 'update' | 'preview' | 'icon' | 'folder' | 'highlight' | 'edit';
export interface HiTableColFormatConfig {
  type: HiTableColFormatConfigType;
  on_url?: string;
  off_url?: string;
  file_name?: string;
  file_suffix?: string;
  if_statement?: boolean;
  active_icon?: string;
  normal_icon?: string;
  file_id?: string;
  content?: string;
  dialog_config?: HiDialogConfig;
  content_config?: ContentConfig;
  placeholder?: string;
  flag_key?: string;
  flag_value?: string;
  num_format?: number;
  form_tag?: string;
  edit_type?: string;
  form_type?: HiFormElTag;
  form_item_config?: FormElementOption;
}
export interface HiDialogConfig { }
export interface ContentConfig { }
