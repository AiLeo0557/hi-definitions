import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineDeleteConfig(
  table_data_excute_args: HiRequestArgument<any>,
  dialog_config?,
) {

  return defineHiTableActionConfig(
    '删除',
    'Delete',
    'Remove',
    'popconfirm',
    true,
    '',
    0,
    0,
    0,
    table_data_excute_args
  )
}