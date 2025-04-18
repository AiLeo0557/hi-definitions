import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineImportConfig(
  table_data_excute_args: HiRequestArgument<any>,
  options?,
  form_config?
) {

  return defineHiTableActionConfig(
    '导入',
    'Box',
    'Import',
    'dialog',
    false,
    '',
    0,
    0,
    0,
    table_data_excute_args
  )
}