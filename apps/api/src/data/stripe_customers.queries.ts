/** Types generated for queries found in "src/data/stripe_customers.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

/** 'GetStripeCustomerByWorkspaceId' parameters type */
export interface IGetStripeCustomerByWorkspaceIdParams {
  workspaceId: string
}

/** 'GetStripeCustomerByWorkspaceId' return type */
export interface IGetStripeCustomerByWorkspaceIdResult {
  created_at: Date
  description: string | null
  email: string
  id: string
  name: string | null
  phone: string | null
  tax_id: string | null
  workspace_id: string
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
      locs: [{ a: 52, b: 64 }],
    },
  ],
  statement:
    'SELECT * FROM stripe_customers WHERE workspace_id = :workspaceId!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_customers WHERE workspace_id = :workspaceId!
 * ```
 */
export const getStripeCustomerByWorkspaceId = new PreparedQuery<
  IGetStripeCustomerByWorkspaceIdParams,
  IGetStripeCustomerByWorkspaceIdResult
>(getStripeCustomerByWorkspaceIdIR)

/** 'GetStripeCustomerById' parameters type */
export interface IGetStripeCustomerByIdParams {
  id: string
}

/** 'GetStripeCustomerById' return type */
export interface IGetStripeCustomerByIdResult {
  created_at: Date
  description: string | null
  email: string
  id: string
  name: string | null
  phone: string | null
  tax_id: string | null
  workspace_id: string
}

/** 'GetStripeCustomerById' query type */
export interface IGetStripeCustomerByIdQuery {
  params: IGetStripeCustomerByIdParams
  result: IGetStripeCustomerByIdResult
}

const getStripeCustomerByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 42, b: 45 }],
    },
  ],
  statement: 'SELECT * FROM stripe_customers WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_customers WHERE id = :id!
 * ```
 */
export const getStripeCustomerById = new PreparedQuery<
  IGetStripeCustomerByIdParams,
  IGetStripeCustomerByIdResult
>(getStripeCustomerByIdIR)

/** 'UpdateStripeCustomerById' parameters type */
export interface IUpdateStripeCustomerByIdParams {
  description: string
  email: string
  id: string
  name: string
  phone: string
  taxId: string
}

/** 'UpdateStripeCustomerById' return type */
export interface IUpdateStripeCustomerByIdResult {
  created_at: Date
  description: string | null
  email: string
  id: string
  name: string | null
  phone: string | null
  tax_id: string | null
  workspace_id: string
}

/** 'UpdateStripeCustomerById' query type */
export interface IUpdateStripeCustomerByIdQuery {
  params: IUpdateStripeCustomerByIdParams
  result: IUpdateStripeCustomerByIdResult
}

const updateStripeCustomerByIdIR: any = {
  usedParamSet: {
    name: true,
    taxId: true,
    email: true,
    description: true,
    phone: true,
    id: true,
  },
  params: [
    {
      name: 'name',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 37, b: 42 }],
    },
    {
      name: 'taxId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 56, b: 62 }],
    },
    {
      name: 'email',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 75, b: 81 }],
    },
    {
      name: 'description',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 100, b: 112 }],
    },
    {
      name: 'phone',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 125, b: 131 }],
    },
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 144, b: 147 }],
    },
  ],
  statement:
    'UPDATE stripe_customers\nSET\n  name = :name!,\n  tax_id = :taxId!,\n  email = :email!,\n  description = :description!,\n  phone = :phone!\nWHERE id = :id!\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE stripe_customers
 * SET
 *   name = :name!,
 *   tax_id = :taxId!,
 *   email = :email!,
 *   description = :description!,
 *   phone = :phone!
 * WHERE id = :id!
 * RETURNING *
 * ```
 */
export const updateStripeCustomerById = new PreparedQuery<
  IUpdateStripeCustomerByIdParams,
  IUpdateStripeCustomerByIdResult
>(updateStripeCustomerByIdIR)
