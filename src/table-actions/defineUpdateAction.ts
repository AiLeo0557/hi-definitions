import { HiRequestArgument } from "hi-utils-pro";
import { defineHiTableActionConfig } from "./defineHiTableActionConfig";

export function defineUpdateConfig(
  table_data_excute_args: HiRequestArgument<any>,
  options?,
  form_config?
) {
  return defineHiTableActionConfig(
    '编辑',
    'EditPen',
    'Edit',
    'dialog',
    true,
    '',
    1024,
    120,
    8,
    table_data_excute_args
  )
}