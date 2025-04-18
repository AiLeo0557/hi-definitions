import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineExportConfig(
  table_data_excute_args: HiRequestArgument<any>,
  dialog_config?,
) {

  return defineHiTableActionConfig(
    '导出',
    'Printer',
    'Export',
    'popconfirm',
    true,
    '',
    0,
    0,
    0,
    table_data_excute_args
  )
}