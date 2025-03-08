/** Types generated for queries found in "src/data/stripe_checkouts.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

export type DateOrString = Date | string

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** 'GetStripeCheckoutById' parameters type */
export interface IGetStripeCheckoutByIdParams {
  id: string
  workspaceId: string
}

/** 'GetStripeCheckoutById' return type */
export interface IGetStripeCheckoutByIdResult {
  createdAt: Date
  customerId: string
  metadata: Json | null
  mode: string
  priceId: string
  sessionId: string
  status: string | null
  workspaceId: string
}

/** 'GetStripeCheckoutById' query type */
export interface IGetStripeCheckoutByIdQuery {
  params: IGetStripeCheckoutByIdParams
  result: IGetStripeCheckoutByIdResult
}

const getStripeCheckoutByIdIR: any = {
  usedParamSet: { id: true, workspaceId: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 50, b: 53 }],
    },
    {
      name: 'workspaceId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 74, b: 86 }],
    },
  ],
  statement:
    'SELECT * FROM stripe_checkouts WHERE session_id = :id! AND workspace_id = :workspaceId!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_checkouts WHERE session_id = :id! AND workspace_id = :workspaceId!
 * ```
 */
export const getStripeCheckoutById = new PreparedQuery<
  IGetStripeCheckoutByIdParams,
  IGetStripeCheckoutByIdResult
>(getStripeCheckoutByIdIR)

/** 'InsertStripeCheckout' parameters type */
export interface IInsertStripeCheckoutParams {
  checkout: {
    createdAt: DateOrString
    customerId: string
    metadata: Json | null | void
    mode: string
    priceId: string
    sessionId: string
    status: string
    workspaceId: string
  }
}

/** 'InsertStripeCheckout' return type */
export interface IInsertStripeCheckoutResult {
  createdAt: Date
  customerId: string
  metadata: Json | null
  mode: string
  priceId: string
  sessionId: string
  status: string | null
  workspaceId: string
}

/** 'InsertStripeCheckout' query type */
export interface IInsertStripeCheckoutQuery {
  params: IInsertStripeCheckoutParams
  result: IInsertStripeCheckoutResult
}

const insertStripeCheckoutIR: any = {
  usedParamSet: { checkout: true },
  params: [
    {
      name: 'checkout',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'workspaceId', required: true },
          { name: 'sessionId', required: true },
          { name: 'customerId', required: true },
          { name: 'priceId', required: true },
          { name: 'mode', required: true },
          { name: 'status', required: true },
          { name: 'metadata', required: false },
          { name: 'createdAt', required: true },
        ],
      },
      locs: [{ a: 121, b: 129 }],
    },
  ],
  statement:
    'INSERT INTO stripe_checkouts (workspace_id, session_id, customer_id, price_id, mode, status,metadata, created_at)\nVALUES :checkout\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_checkouts (workspace_id, session_id, customer_id, price_id, mode, status,metadata, created_at)
 * VALUES :checkout
 * RETURNING *
 * ```
 */
export const insertStripeCheckout = new PreparedQuery<
  IInsertStripeCheckoutParams,
  IInsertStripeCheckoutResult
>(insertStripeCheckoutIR)
