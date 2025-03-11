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

/** 'GetStripeCheckoutByIdAndWorkspaceId' parameters type */
export interface IGetStripeCheckoutByIdAndWorkspaceIdParams {
  id: string
  workspaceId: string
}

/** 'GetStripeCheckoutByIdAndWorkspaceId' return type */
export interface IGetStripeCheckoutByIdAndWorkspaceIdResult {
  created_at: Date
  customer_id: string
  metadata: Json | null
  mode: string
  price_id: string
  session_id: string
  status: string | null
  workspace_id: string
}

/** 'GetStripeCheckoutByIdAndWorkspaceId' query type */
export interface IGetStripeCheckoutByIdAndWorkspaceIdQuery {
  params: IGetStripeCheckoutByIdAndWorkspaceIdParams
  result: IGetStripeCheckoutByIdAndWorkspaceIdResult
}

const getStripeCheckoutByIdAndWorkspaceIdIR: any = {
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
export const getStripeCheckoutByIdAndWorkspaceId = new PreparedQuery<
  IGetStripeCheckoutByIdAndWorkspaceIdParams,
  IGetStripeCheckoutByIdAndWorkspaceIdResult
>(getStripeCheckoutByIdAndWorkspaceIdIR)

/** 'GetStripeCheckoutById' parameters type */
export interface IGetStripeCheckoutByIdParams {
  id: string
}

/** 'GetStripeCheckoutById' return type */
export interface IGetStripeCheckoutByIdResult {
  created_at: Date
  customer_id: string
  metadata: Json | null
  mode: string
  price_id: string
  session_id: string
  status: string | null
  workspace_id: string
}

/** 'GetStripeCheckoutById' query type */
export interface IGetStripeCheckoutByIdQuery {
  params: IGetStripeCheckoutByIdParams
  result: IGetStripeCheckoutByIdResult
}

const getStripeCheckoutByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 50, b: 53 }],
    },
  ],
  statement: 'SELECT * FROM stripe_checkouts WHERE session_id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_checkouts WHERE session_id = :id!
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
  created_at: Date
  customer_id: string
  metadata: Json | null
  mode: string
  price_id: string
  session_id: string
  status: string | null
  workspace_id: string
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

/** 'UpdateStripeCheckoutStatus' parameters type */
export interface IUpdateStripeCheckoutStatusParams {
  sessionId: string
  status: string
}

/** 'UpdateStripeCheckoutStatus' return type */
export interface IUpdateStripeCheckoutStatusResult {
  created_at: Date
  customer_id: string
  metadata: Json | null
  mode: string
  price_id: string
  session_id: string
  status: string | null
  workspace_id: string
}

/** 'UpdateStripeCheckoutStatus' query type */
export interface IUpdateStripeCheckoutStatusQuery {
  params: IUpdateStripeCheckoutStatusParams
  result: IUpdateStripeCheckoutStatusResult
}

const updateStripeCheckoutStatusIR: any = {
  usedParamSet: { status: true, sessionId: true },
  params: [
    {
      name: 'status',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 37, b: 44 }],
    },
    {
      name: 'sessionId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 65, b: 75 }],
    },
  ],
  statement:
    'UPDATE stripe_checkouts\nSET status = :status!\nWHERE session_id = :sessionId!\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE stripe_checkouts
 * SET status = :status!
 * WHERE session_id = :sessionId!
 * RETURNING *
 * ```
 */
export const updateStripeCheckoutStatus = new PreparedQuery<
  IUpdateStripeCheckoutStatusParams,
  IUpdateStripeCheckoutStatusResult
>(updateStripeCheckoutStatusIR)
