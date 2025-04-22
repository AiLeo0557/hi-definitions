import { getStringBetween } from 'hi-utils-pro'
import { type HiRequestArgument } from 'hi-http'
import { defineAccessConfig, defineDeleteConfig, defineExportConfig, defineInsertConfig, defineUpdateConfig } from './table-actions'
import { defineImportConfig } from './table-actions/defineImportAction'
export type HiTableActionType = 'dialog' | 'inline' | 'popconfirm' | 'router' | 'view'
export interface HiTableActionConfig {
  icon: string // 图标
  label: string // 操作名称
  command: string // 命令
  config: {
    type: HiTableActionType
    relied: boolean // 是否依赖 selected table data
    dialog_config?: {
      title: string // 弹窗标题
      width: number // 弹窗宽度
      height: number // 弹窗高度
      labelWidth: number // 弹窗表单项标题宽度
      defaultSpan: number // 弹窗表单项宽度
      hide_footer?: boolean // 是否隐藏底部
    } // 弹窗配置
    content_config?: {
      component_name: string // 弹窗内容组件
      component_attrs?: Record<string, any> // 弹窗内容组件props
    } // 弹窗内容配置
    table_data_excute_args: HiRequestArgument<any> // 表格数据执行参数
    tip_config?: {
      title: string // 提示标题
      content: string // 提示内容
      confirm_text: string // 确认按钮文本
      cancel_text: string // 取消按钮文本
      confirm_type: 'primary' | 'danger' // 确认按钮类型
      when: (data: Record<string, any>) => boolean // 提示条件
    } | null // 提示配置
    /** 导入操作相关配置项 */
    show_download_btn?: boolean // 是否
    download_template_url?: string // 模版下载地址
    download_template_name?: string // 下载模版文件名称
    download_template_params?: Record<string, any> // 模版下载参数
    upload_file_url?: string // 文件上传地址
    upload_on_confirm?: boolean // 点击确定按钮后执行上传操作
    upload_on_change?: boolean // upload input change 后是否执行上传操作
    upload_filedata_view?: boolean // 是否展示上传成功后的数据
    upload_file_args?: HiRequestArgument<any> // 文件上传 Args
    save_tabledata_url?: string // 上传完成后保存上传数据的地址
    comfirm_btn_text?: string // 弹窗底部确定按钮名称
    /** 导出操作相关配置项 */
    exportFileTitle?: string // 导出文件名称
  }
}

export interface HiTableActionOption {
  items?: HiTableActionConfig[] // 操作按钮
  [key: string]: any
}

export function defineHiTableActionsConfig(config: HiTableActionOption) {
  if (config.items) {
    return config.items
  }
  const keys = Object.keys(config)
  const excute_keys =
    keys.filter((key: string) => key.startsWith('table_data'))
      .map((key: string) => getStringBetween(key, 'data_', '_args'))
  console.log('excute_keys:', excute_keys)
  return excute_keys.map((key: string) => {
    let url = Reflect.get(config, `table_data_${key}_args_url`)
    if (key === 'export') {
      url = url || Reflect.get((import.meta as any).env, 'VITE_EXPORT_API')
    }
    const args: HiRequestArgument<any> =
      Reflect.get(config, `table_data_${key}_args`) || [url]
    const options = Reflect.get(config, `table_data_${key}_options`)
    const form_config = Reflect.get(config, `table_data_${key}_form`)
    switch (key) {
      case 'insert':
        return defineInsertConfig(args, options, form_config)
      case 'update':
        return defineUpdateConfig(args, options, form_config)
      case 'delete':
        return defineDeleteConfig(args, options)
      case 'export':
        return defineExportConfig(args, options)
      case 'import':
        return defineImportConfig(args, options)
      case 'access':
        return defineAccessConfig(args, options)
    }
  })
}