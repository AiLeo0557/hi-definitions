import type { EnumOptionsAlias, HiSelectOptionsConfig } from "./defineHiSelectConfig";

/**
 * author: 杜朝辉
 * date: 2025-02-19
 * description: 枚举选项定义
 */
export function defineEnumOptions(codeType: string, alias_str?: string): HiSelectOptionsConfig<{ codeType: string }> {
  const alias = alias_str?.split(',') as EnumOptionsAlias || ['enumValue', 'enumCode'];
  return {
    alias,
    args: [
      Reflect.get((import.meta as any).env, 'VITE_ENUM_API'),
      {
        codeType
      },
      {
        res_key_name: 'res.resultValue.0.value'
      }
    ]
  }
}