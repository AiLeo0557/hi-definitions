import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineInsertConfig(
  table_data_excute_args: HiRequestArgument<any>,
  options?,
  form_config?
) {
  return defineHiTableActionConfig(
    '新增',
    'Plus',
    'Add',
    'dialog',
    false,
    '',
    1024,
    120,
    8,
    table_data_excute_args
  )
}