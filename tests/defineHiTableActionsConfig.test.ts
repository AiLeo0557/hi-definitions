import { describe, expect, beforeAll, it } from 'vitest'

import { defineHiTableActionsConfig } from '../dist/index'

describe('defineHiTableActionsConfig', () => {
  const actions_config = {
    table_data_insert_args: ['actions/add'],
    table_data_update_args_url: 'actions/update',
    table_data_export_args_url: 'actions/export',
  }
  defineHiTableActionsConfig(actions_config)
})
