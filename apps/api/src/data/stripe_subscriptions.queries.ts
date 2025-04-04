/** Types generated for queries found in "src/data/stripe_subscriptions.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

export type DateOrString = Date | string

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** 'UpsertStripeSubscription' parameters type */
export interface IUpsertStripeSubscriptionParams {
  subscription: {
    canceledAt: DateOrString | null | void
    canceledAtPeriodEnd: DateOrString | null | void
    createdAt: DateOrString
    currentPeriodEnd: DateOrString
    currentPeriodStart: DateOrString
    customerId: string
    id: string
    metadata: Json | null | void
    priceId: string
    quantity: number
    status: string
    trialPeriodEnd: DateOrString | null | void
    trialPeriodStart: DateOrString | null | void
    workspaceId: string
  }
}

/** 'UpsertStripeSubscription' return type */
export interface IUpsertStripeSubscriptionResult {
  canceled_at: Date | null
  canceled_at_period_end: Date | null
  created_at: Date
  current_period_end: Date
  current_period_start: Date
  customer_id: string
  id: string
  metadata: Json | null
  price_id: string
  quantity: number | null
  status: string | null
  trial_period_end: Date | null
  trial_period_start: Date | null
  workspace_id: string
}

/** 'UpsertStripeSubscription' query type */
export interface IUpsertStripeSubscriptionQuery {
  params: IUpsertStripeSubscriptionParams
  result: IUpsertStripeSubscriptionResult
}

const upsertStripeSubscriptionIR: any = {
  usedParamSet: { subscription: true },
  params: [
    {
      name: 'subscription',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'workspaceId', required: true },
          { name: 'id', required: true },
          { name: 'customerId', required: true },
          { name: 'priceId', required: true },
          { name: 'currentPeriodStart', required: true },
          { name: 'currentPeriodEnd', required: true },
          { name: 'status', required: true },
          { name: 'quantity', required: true },
          { name: 'metadata', required: false },
          { name: 'trialPeriodStart', required: false },
          { name: 'trialPeriodEnd', required: false },
          { name: 'canceledAt', required: false },
          { name: 'canceledAtPeriodEnd', required: false },
          { name: 'createdAt', required: true },
        ],
      },
      locs: [{ a: 239, b: 251 }],
    },
  ],
  statement:
    'INSERT INTO stripe_subscriptions (workspace_id, id, customer_id, price_id, current_period_start, current_period_end, status, quantity, metadata, trial_period_start, trial_period_end, canceled_at, canceled_at_period_end, created_at)\nVALUES :subscription\nON CONFLICT (id) DO UPDATE SET\n    customer_id = EXCLUDED.customer_id,\n    price_id = EXCLUDED.price_id,\n    current_period_start = EXCLUDED.current_period_start,\n    current_period_end = EXCLUDED.current_period_end,\n    status = EXCLUDED.status,\n    quantity = EXCLUDED.quantity,\n    metadata = EXCLUDED.metadata,\n    trial_period_start = EXCLUDED.trial_period_start,\n    trial_period_end = EXCLUDED.trial_period_end,\n    canceled_at = EXCLUDED.canceled_at,\n    canceled_at_period_end = EXCLUDED.canceled_at_period_end\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_subscriptions (workspace_id, id, customer_id, price_id, current_period_start, current_period_end, status, quantity, metadata, trial_period_start, trial_period_end, canceled_at, canceled_at_period_end, created_at)
 * VALUES :subscription
 * ON CONFLICT (id) DO UPDATE SET
 *     customer_id = EXCLUDED.customer_id,
 *     price_id = EXCLUDED.price_id,
 *     current_period_start = EXCLUDED.current_period_start,
 *     current_period_end = EXCLUDED.current_period_end,
 *     status = EXCLUDED.status,
 *     quantity = EXCLUDED.quantity,
 *     metadata = EXCLUDED.metadata,
 *     trial_period_start = EXCLUDED.trial_period_start,
 *     trial_period_end = EXCLUDED.trial_period_end,
 *     canceled_at = EXCLUDED.canceled_at,
 *     canceled_at_period_end = EXCLUDED.canceled_at_period_end
 * RETURNING *
 * ```
 */
export const upsertStripeSubscription = new PreparedQuery<
  IUpsertStripeSubscriptionParams,
  IUpsertStripeSubscriptionResult
>(upsertStripeSubscriptionIR)

/** 'DeleteStripeSubscription' parameters type */
export interface IDeleteStripeSubscriptionParams {
  id: string
}

/** 'DeleteStripeSubscription' return type */
export type IDeleteStripeSubscriptionResult = void

/** 'DeleteStripeSubscription' query type */
export interface IDeleteStripeSubscriptionQuery {
  params: IDeleteStripeSubscriptionParams
  result: IDeleteStripeSubscriptionResult
}

const deleteStripeSubscriptionIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 44, b: 47 }],
    },
  ],
  statement: 'DELETE FROM stripe_subscriptions WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM stripe_subscriptions WHERE id = :id!
 * ```
 */
export const deleteStripeSubscription = new PreparedQuery<
  IDeleteStripeSubscriptionParams,
  IDeleteStripeSubscriptionResult
>(deleteStripeSubscriptionIR)

/** 'GetStripeSubscriptionById' parameters type */
export interface IGetStripeSubscriptionByIdParams {
  id: string
}

/** 'GetStripeSubscriptionById' return type */
export interface IGetStripeSubscriptionByIdResult {
  canceled_at: Date | null
  canceled_at_period_end: Date | null
  created_at: Date
  current_period_end: Date
  current_period_start: Date
  customer_id: string
  id: string
  metadata: Json | null
  price_id: string
  quantity: number | null
  status: string | null
  trial_period_end: Date | null
  trial_period_start: Date | null
  workspace_id: string
}

/** 'GetStripeSubscriptionById' query type */
export interface IGetStripeSubscriptionByIdQuery {
  params: IGetStripeSubscriptionByIdParams
  result: IGetStripeSubscriptionByIdResult
}

const getStripeSubscriptionByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 46, b: 49 }],
    },
  ],
  statement: 'SELECT * FROM stripe_subscriptions WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_subscriptions WHERE id = :id!
 * ```
 */
export const getStripeSubscriptionById = new PreparedQuery<
  IGetStripeSubscriptionByIdParams,
  IGetStripeSubscriptionByIdResult
>(getStripeSubscriptionByIdIR)

/** 'GetStripeSubscriptionsByWorkspaceId' parameters type */
export interface IGetStripeSubscriptionsByWorkspaceIdParams {
  workspaceId: string
}

/** 'GetStripeSubscriptionsByWorkspaceId' return type */
export interface IGetStripeSubscriptionsByWorkspaceIdResult {
  canceled_at: Date | null
  canceled_at_period_end: Date | null
  created_at: Date
  current_period_end: Date
  current_period_start: Date
  customer_id: string
  id: string
  metadata: Json | null
  price_id: string
  product_id: string
  quantity: number | null
  status: string | null
  trial_period_end: Date | null
  trial_period_start: Date | null
  workspace_id: string
}

/** 'GetStripeSubscriptionsByWorkspaceId' query type */
export interface IGetStripeSubscriptionsByWorkspaceIdQuery {
  params: IGetStripeSubscriptionsByWorkspaceIdParams
  result: IGetStripeSubscriptionsByWorkspaceIdResult
}

const getStripeSubscriptionsByWorkspaceIdIR: any = {
  usedParamSet: { workspaceId: true },
  params: [
    {
      name: 'workspaceId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 204, b: 216 }],
    },
  ],
  statement:
    'SELECT\n  s.*,\n  product.id as product_id\nFROM stripe_subscriptions s\nJOIN stripe_prices price ON s.price_id = price.id\nJOIN stripe_products product ON price.product_id = product.id\nWHERE s.workspace_id = :workspaceId!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   s.*,
 *   product.id as product_id
 * FROM stripe_subscriptions s
 * JOIN stripe_prices price ON s.price_id = price.id
 * JOIN stripe_products product ON price.product_id = product.id
 * WHERE s.workspace_id = :workspaceId!
 * ```
 */
export const getStripeSubscriptionsByWorkspaceId = new PreparedQuery<
  IGetStripeSubscriptionsByWorkspaceIdParams,
  IGetStripeSubscriptionsByWorkspaceIdResult
>(getStripeSubscriptionsByWorkspaceIdIR)

/** 'GetCurrentStripeSubscriptionsByWorkspaceId' parameters type */
export interface IGetCurrentStripeSubscriptionsByWorkspaceIdParams {
  workspaceId: string
}

/** 'GetCurrentStripeSubscriptionsByWorkspaceId' return type */
export interface IGetCurrentStripeSubscriptionsByWorkspaceIdResult {
  canceled_at: Date | null
  canceled_at_period_end: Date | null
  created_at: Date
  current_period_end: Date
  current_period_start: Date
  customer_id: string
  id: string
  metadata: Json | null
  price_id: string
  product_id: string
  quantity: number | null
  status: string | null
  trial_period_end: Date | null
  trial_period_start: Date | null
  workspace_id: string
}

/** 'GetCurrentStripeSubscriptionsByWorkspaceId' query type */
export interface IGetCurrentStripeSubscriptionsByWorkspaceIdQuery {
  params: IGetCurrentStripeSubscriptionsByWorkspaceIdParams
  result: IGetCurrentStripeSubscriptionsByWorkspaceIdResult
}

const getCurrentStripeSubscriptionsByWorkspaceIdIR: any = {
  usedParamSet: { workspaceId: true },
  params: [
    {
      name: 'workspaceId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 204, b: 216 }],
    },
  ],
  statement:
    'SELECT\n  s.*,\n  product.id as product_id\nFROM stripe_subscriptions s\nJOIN stripe_prices price ON s.price_id = price.id\nJOIN stripe_products product ON price.product_id = product.id\nWHERE s.workspace_id = :workspaceId!\nAND (s.canceled_at IS NULL OR s.canceled_at <= NOW())\nORDER BY s.current_period_start ASC\nLIMIT 1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   s.*,
 *   product.id as product_id
 * FROM stripe_subscriptions s
 * JOIN stripe_prices price ON s.price_id = price.id
 * JOIN stripe_products product ON price.product_id = product.id
 * WHERE s.workspace_id = :workspaceId!
 * AND (s.canceled_at IS NULL OR s.canceled_at <= NOW())
 * ORDER BY s.current_period_start ASC
 * LIMIT 1
 * ```
 */
export const getCurrentStripeSubscriptionsByWorkspaceId = new PreparedQuery<
  IGetCurrentStripeSubscriptionsByWorkspaceIdParams,
  IGetCurrentStripeSubscriptionsByWorkspaceIdResult
>(getCurrentStripeSubscriptionsByWorkspaceIdIR)
