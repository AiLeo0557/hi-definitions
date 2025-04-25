import { reactive, Ref, ref } from "@vue/reactivity";
import { defineHiSiderConfig } from "./defineHiSiderConfig";
import { defineHiOverviewConfig } from "./defineHiOverviewConfig";

interface HiPageOption {
  page_title: string // 页面标题
  page_name: string // 页面名称
  sider_config?: any // 侧边栏配置
  state_data_config?: Record<string, any> // 页面状态数据配置
  chart_config?: any // 图表配置
  overview_config?: any // 概览配置
  layout_config?: any // 布局配置
}
export function defineHiPageConfig(options: Ref<HiPageOption>) {
  const name = ref<string>();
  const tableConfig = ref<any>(null);
  const tableGroupList = ref<any>(null);
  const tableGroupLayout = ref<string>('row');
  const useHiddenSubTable = ref<boolean>(false);
  const searchFormConfig = ref<any>(null);
  const siderConfig = ref<any>(null);
  const chartConfig = ref<any>(null);
  const overviewConfig = ref<any>(null);
  const actionsConfig = ref<any>(null);
  // 初始化 page_state
  const page_state = reactive<Record<string, any>>({
    searchFormData: {},
    tableDataParam: {},
  })
  const {
    page_title,
    page_name,
    // actions_config = {},
    // table_config,
    // form_config = {},
    sider_config,
    chart_config,
    overview_config,
    // overview_group_config,
    // table_group_config,
    layout_config,
    state_data_config
  } = options.value
  if (state_data_config) {
    Object.assign(page_state, state_data_config)
  }
  if (sider_config) {
    siderConfig.value = defineHiSiderConfig(sider_config)
  }
  if (overview_config) {
    overviewConfig.value = overview_config
  }
  // defineHiOverviewConfig
}