/** Types generated for queries found in "src/src/data/stripe_customers.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

/** 'UpsertStripeCustomer' parameters type */
export interface IUpsertStripeCustomerParams {
  customer: {
    email: string
    id: string
    name: string
    workspaceId: string
  }
}

/** 'UpsertStripeCustomer' return type */
export interface IUpsertStripeCustomerResult {
  addressId: string | null
  createdAt: Date
  description: string | null
  email: string
  id: string
  name: string | null
  phone: string | null
  workspaceId: string | null
}

/** 'UpsertStripeCustomer' query type */
export interface IUpsertStripeCustomerQuery {
  params: IUpsertStripeCustomerParams
  result: IUpsertStripeCustomerResult
}

const upsertStripeCustomerIR: any = {
  usedParamSet: { customer: true },
  params: [
    {
      name: 'customer',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'id', required: true },
          { name: 'email', required: true },
          { name: 'name', required: true },
          { name: 'workspaceId', required: true },
        ],
      },
      locs: [{ a: 68, b: 76 }],
    },
  ],
  statement:
    'INSERT INTO stripe_customers (id, email, name, workspace_id)\nVALUES :customer\nON CONFLICT (id) DO UPDATE SET\n    email = EXCLUDED.email,\n    name = EXCLUDED.name,\n    workspace_id = EXCLUDED.workspace_id\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_customers (id, email, name, workspace_id)
 * VALUES :customer
 * ON CONFLICT (id) DO UPDATE SET
 *     email = EXCLUDED.email,
 *     name = EXCLUDED.name,
 *     workspace_id = EXCLUDED.workspace_id
 * RETURNING *
 * ```
 */
export const upsertStripeCustomer = new PreparedQuery<
  IUpsertStripeCustomerParams,
  IUpsertStripeCustomerResult
>(upsertStripeCustomerIR)

/** 'GetStripeCustomerByWorkspaceId' parameters type */
export interface IGetStripeCustomerByWorkspaceIdParams {
  workspaceId: string
}

/** 'GetStripeCustomerByWorkspaceId' return type */
export interface IGetStripeCustomerByWorkspaceIdResult {
  addressId: string | null
  createdAt: Date
  description: string | null
  email: string
  id: string
  name: string | null
  phone: string | null
  workspaceId: string | null
}

/** 'GetStripeCustomerByWorkspaceId' query type */
export interface IGetStripeCustomerByWorkspaceIdQuery {
  params: IGetStripeCustomerByWorkspaceIdParams
  result: IGetStripeCustomerByWorkspaceIdResult
}

const getStripeCustomerByWorkspaceIdIR: any = {
  usedParamSet: { workspaceId: true },
  params: [
    {
      name: 'workspaceId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 54, b: 66 }],
    },
  ],
  statement:
    'SELECT\n  *\nFROM stripe_customers\nWHERE workspace_id = :workspaceId!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM stripe_customers
 * WHERE workspace_id = :workspaceId!
 * ```
 */
export const getStripeCustomerByWorkspaceId = new PreparedQuery<
  IGetStripeCustomerByWorkspaceIdParams,
  IGetStripeCustomerByWorkspaceIdResult
>(getStripeCustomerByWorkspaceIdIR)
