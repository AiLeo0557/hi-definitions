import { HiRequestArgument } from "hi-utils-pro";
import { HiTableActionType, type HiTableActionConfig } from "src/defineHiTableActionsConfig";
/**
 * 定义table数据操作配置项
 * @param label 操作按钮名称
 * @param icon  操作按钮 ICON
 * @param command 操作类型：增删改
 * @param type  点击操作按钮后的交换方式
 * @param relied 是否依赖选中数据
 * @param title 弹窗标题
 * @param width 弹窗宽度
 * @param labelWidth 弹窗表单项标题宽度
 * @param defaultSpan 弹窗表单项宽度
 * @param table_data_excute_args 操作数据接口配置
 * @returns HiTableActionConfig
 * @author 杜朝辉
 * @date 2025-04-18
 */

export function defineHiTableActionConfig(
  label: string,
  icon: string,
  command: string,
  type: HiTableActionType,
  relied: boolean,
  title: string,
  width: number,
  labelWidth: number,
  defaultSpan: number,
  table_data_excute_args: HiRequestArgument<any>
): HiTableActionConfig {
  return {
    label,
    icon,
    command,
    config: {
      type,
      relied,
      dialog_config: {
        title,
        width,
        labelWidth,
        defaultSpan
      },
      table_data_excute_args,
      // 导入操作配置项

    }
  }
}