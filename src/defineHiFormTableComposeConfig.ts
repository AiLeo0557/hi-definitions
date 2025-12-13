import { ref } from "@vue/reactivity";
import { HiTableConfig } from "./defineHiTableConfig";
import { HiFormConfig } from "./defineHiFormItems";
import { HiSiderConfig } from "./defineHiSiderConfig";
export enum TableLayoutConfig {
  ROW = 'row',
  COL = 'column',
  TAB = 'tabs',
  SCROLL = 'scroll'
}
export type HiChartType =
  | 'lines' // 折线图
  | 'columns' // 柱状图
  | 'pie' // 饼图
  | 'steplines'
export interface HiChartConfig {

}

export default function defineHiFormTableComposeConfig(options) {
  const name = ref<string>()
  const tableConfig = ref<HiTableConfig>()
  const tableGroupList = ref<HiTableConfig[]>()
  const tableGroupLayout = ref<TableLayoutConfig>()
  const useHiddenSubTable = ref<boolean>()
  const searchFormConfig = ref<HiFormConfig<any>>()
  const siderConfig = ref<HiSiderConfig>()
  const chartConfig = ref<HiChartConfig>()
}