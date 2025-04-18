import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineAccessConfig(
  table_data_excute_args: HiRequestArgument<any>,
  dialog_config?,
) {

  return defineHiTableActionConfig(
    '接入',
    'Pointer',
    'Access',
    'dialog',
    false,
    '数据接入',
    0,
    0,
    0,
    table_data_excute_args
  )
}