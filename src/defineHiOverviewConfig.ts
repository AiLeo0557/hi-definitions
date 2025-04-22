import { computed, reactive } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { type HiDataSourcesApiConfig, useAsyncData } from "hi-hooks"
import { getFieldValueByPath, getFormatNum, getStringBetween } from "hi-utils-pro";
import { isNumber } from "hi-datatype-operation";
export interface HiOverviewOptions {
  key?: string
  items: Record<string, any>[],
  data_config: HiDataSourcesApiConfig<any>,
}
interface TriggerConfig {
  event_type: 'click' | 'hover' | 'focus' | 'blur' // 事件类型
  run_code: string // 运行代码
}
export function defineHiOverviewConfig(
  options: HiOverviewOptions,
  props: any,
) {
  const page_state: Record<string, any> = inject('page_state', reactive({}))
  return computed(async () => {
    const overview_data = useAsyncData(options.data_config, { props, page_state })
    return options.items.map((item) => {
      let [key, label] = Object.entries(item)[0]
      const value = Reflect.get(overview_data, key) || '-'
      const format_num: number = Reflect.has(item, '_format')
        ? Number(Reflect.get(item, '_format'))
        : 2
      if (label.includes('||')) {
        let [label_key, default_label_value] = label.split('||')
        label_key = getStringBetween(label_key, '{{', '}}')
        label = getFieldValueByPath(label_key, overview_data, default_label_value)
      }
      const new_item = {
        key,
        label: label.replace(/{{.*?}}/g, (_: string, str: string) => {
          return Reflect.get(overview_data, str)
        }),
        value: isNumber(value) ? getFormatNum(value, format_num) : value,
      }
      if (Reflect.has(item, '_trigger')) {
        const trigger_config: TriggerConfig = Reflect.get(item, '_trigger')
        const event_type = Reflect.get(trigger_config, 'event_type')
        if (event_type && event_type === 'click') {
          const onClick = new Function('page_state', trigger_config.run_code)
          Reflect.set(new_item, 'style', { cursor: 'pointer' })
          Reflect.set(new_item, 'onClick', onClick.bind(null, page_state))
        }
      }
      return new_item
    })
  })
}