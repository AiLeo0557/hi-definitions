import { HiRequestArgument } from "hi-http";
import { HiFormItemsConfig } from "./defineHiFormItems";
import { checkNullToUndefined } from "hi-datatype-operation";


export interface HiSiderOptions {
  args: HiRequestArgument<any>;
  attrs: [
    children: string,
    label: string,
    nodeKey: string,
    nodeValueKey: string,
    update_table_param_name: string,
    defaultSelectedFirstItem: boolean,
    default_last_leavel_id: string,
  ]
  actions: {
    [key in TreeActionType]: TreeActionItemConfig
  }
  update_config?: Record<string, string>
  default_height?: number
}
interface BaseConfig {
  label: string
  name: string
  icon: string
  relied?: boolean
}
/**
 *  // label: string; // 按钮名称
  // icon?: string; // 图标
  // name: string; // 按钮名称
  // relied: boolean; // 是否依赖 selected table data
  // interaction_type: 'dialog' | 'inline' | 'popconfirm' | 'router' | 'view'; // 交互类型
 */
export type TreeActionType = 'action_edit_config' | 'action_add_config' | 'action_delete_config'
interface TreeActionItemConfig extends BaseConfig {
  args: HiRequestArgument<any>
  display_condition: Record<string, string>
  form_config_items?: HiFormItemsConfig
  dialog_config?: {
    width: number
    title: string
    labelWidth: number
    default: number
  }
}
function defineActionCofig(base: BaseConfig, options: TreeActionItemConfig) {

}
export function defineHiSiderConfig(options: HiSiderOptions): HiSiderActionConfig {
  // return options
  const { args, attrs, actions, update_config, default_height } = options
  const [children, label, nodeKey, nodeValueKey, update_table_param_name, defaultSelectedFirstItem, default_last_leavel_id] = attrs
  let actions_config: any = actions ? { items: [] } : null
  const keys = actions ? Object.keys(actions) : []
  for (let key of keys) {
    const action_config = Reflect.get(actions, key)
    switch (key) {
      case 'action_edit_config':
        actions_config.items.push(
          defineActionCofig({
            label: '编辑',
            name: 'edit',
            icon: 'EditPen',
            relied: true
          }, action_config)
        )
        break
      case 'action_delete_config':
        actions_config.items.push(
          defineActionCofig({
            label: '删除',
            name: 'delete',
            icon: 'Delete'
          }, action_config)
        )
        break
      case 'action_add_config':
        actions_config.items.push(
          defineActionCofig({
            label: '新增',
            name: 'add',
            icon: 'CirclePlus'
          }, action_config)
        )
        break
    }
  }

  return {
    args,
    defaultProp: {
      children: checkNullToUndefined(children),
      label: checkNullToUndefined(label)
    },
    nodeKey: checkNullToUndefined(nodeKey),
    nodeValueKey: checkNullToUndefined(nodeValueKey),
    update_table_param_name: checkNullToUndefined(update_table_param_name),
    defaultSelectedFirstItem: checkNullToUndefined(defaultSelectedFirstItem),
    default_last_leavel_id: checkNullToUndefined(default_last_leavel_id),
    actions_config: checkNullToUndefined(actions_config),
    update_config,
    default_height
  }
}
interface HiSiderActionConfig {
  args?: HiRequestArgument<any>; // 请求参数
  defaultProp: {
    children: string
    label: string
  }
  nodeKey?: string
  nodeValueKey?: string
  update_table_param_name?: string
  defaultSelectedFirstItem?: boolean
  default_last_leavel_id?: string
  actions_config?: {
    items: TreeActionItemConfig[]; // 操作按钮
  }; // 操作按钮配置
  update_config?: Record<string, string>; // 更新配置
  default_height?: number; // 默认高度
  display_condition?: {
    key: string; // 关联字段
    value: string; // 关联值
    be_equal: boolean; // 是否相等
    be_smaller?: boolean; // 是否小于
  }
  tip_msg?: string; // 提示信息
}