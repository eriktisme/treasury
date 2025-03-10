/** Types generated for queries found in "src/data/stripe_prices.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** 'UpsertStripePrice' parameters type */
export interface IUpsertStripePriceParams {
  price: {
    active: boolean
    currency: string | null | void
    id: string
    lookupKey: string | null | void
    metadata: Json | null | void
    productId: string
    recurringCount: number | null | void
    recurringInterval: string | null | void
    unitAmount: number | null | void
  }
}

/** 'UpsertStripePrice' return type */
export interface IUpsertStripePriceResult {
  active: boolean
  created_at: Date
  currency: string | null
  id: string
  lookup_key: string | null
  metadata: Json | null
  product_id: string
  recurring_count: number | null
  recurring_interval: string | null
  unit_amount: number | null
}

/** 'UpsertStripePrice' query type */
export interface IUpsertStripePriceQuery {
  params: IUpsertStripePriceParams
  result: IUpsertStripePriceResult
}

const upsertStripePriceIR: any = {
  usedParamSet: { price: true },
  params: [
    {
      name: 'price',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'id', required: true },
          { name: 'productId', required: true },
          { name: 'unitAmount', required: false },
          { name: 'currency', required: false },
          { name: 'recurringInterval', required: false },
          { name: 'recurringCount', required: false },
          { name: 'active', required: true },
          { name: 'metadata', required: false },
          { name: 'lookupKey', required: false },
        ],
      },
      locs: [{ a: 140, b: 145 }],
    },
  ],
  statement:
    'INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata, lookup_key)\nVALUES :price\nON CONFLICT (id) DO UPDATE SET\n    product_id = EXCLUDED.product_id,\n    unit_amount = EXCLUDED.unit_amount,\n    currency = EXCLUDED.currency,\n    recurring_interval = EXCLUDED.recurring_interval,\n    recurring_count = EXCLUDED.recurring_count,\n    active = EXCLUDED.active,\n    lookup_key = EXCLUDED.lookup_key,\n    metadata = EXCLUDED.metadata\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata, lookup_key)
 * VALUES :price
 * ON CONFLICT (id) DO UPDATE SET
 *     product_id = EXCLUDED.product_id,
 *     unit_amount = EXCLUDED.unit_amount,
 *     currency = EXCLUDED.currency,
 *     recurring_interval = EXCLUDED.recurring_interval,
 *     recurring_count = EXCLUDED.recurring_count,
 *     active = EXCLUDED.active,
 *     lookup_key = EXCLUDED.lookup_key,
 *     metadata = EXCLUDED.metadata
 * RETURNING *
 * ```
 */
export const upsertStripePrice = new PreparedQuery<
  IUpsertStripePriceParams,
  IUpsertStripePriceResult
>(upsertStripePriceIR)

/** 'DeleteStripePrice' parameters type */
export interface IDeleteStripePriceParams {
  id: string
}

/** 'DeleteStripePrice' return type */
export type IDeleteStripePriceResult = void

/** 'DeleteStripePrice' query type */
export interface IDeleteStripePriceQuery {
  params: IDeleteStripePriceParams
  result: IDeleteStripePriceResult
}

const deleteStripePriceIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 37, b: 40 }],
    },
  ],
  statement: 'DELETE FROM stripe_prices WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM stripe_prices WHERE id = :id!
 * ```
 */
export const deleteStripePrice = new PreparedQuery<
  IDeleteStripePriceParams,
  IDeleteStripePriceResult
>(deleteStripePriceIR)

/** 'GetStripePriceById' parameters type */
export interface IGetStripePriceByIdParams {
  id: string
}

/** 'GetStripePriceById' return type */
export interface IGetStripePriceByIdResult {
  active: boolean
  created_at: Date
  currency: string | null
  id: string
  lookup_key: string | null
  metadata: Json | null
  product_id: string
  recurring_count: number | null
  recurring_interval: string | null
  unit_amount: number | null
}

/** 'GetStripePriceById' query type */
export interface IGetStripePriceByIdQuery {
  params: IGetStripePriceByIdParams
  result: IGetStripePriceByIdResult
}

const getStripePriceByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 39, b: 42 }],
    },
  ],
  statement: 'SELECT * FROM stripe_prices WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_prices WHERE id = :id!
 * ```
 */
export const getStripePriceById = new PreparedQuery<
  IGetStripePriceByIdParams,
  IGetStripePriceByIdResult
>(getStripePriceByIdIR)

/** 'GetStripePriceByLookupKey' parameters type */
export interface IGetStripePriceByLookupKeyParams {
  key: string
}

/** 'GetStripePriceByLookupKey' return type */
export interface IGetStripePriceByLookupKeyResult {
  active: boolean
  created_at: Date
  currency: string | null
  id: string
  lookup_key: string | null
  metadata: Json | null
  product_id: string
  recurring_count: number | null
  recurring_interval: string | null
  unit_amount: number | null
}

/** 'GetStripePriceByLookupKey' query type */
export interface IGetStripePriceByLookupKeyQuery {
  params: IGetStripePriceByLookupKeyParams
  result: IGetStripePriceByLookupKeyResult
}

const getStripePriceByLookupKeyIR: any = {
  usedParamSet: { key: true },
  params: [
    {
      name: 'key',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 47, b: 51 }],
    },
  ],
  statement: 'SELECT * FROM stripe_prices WHERE lookup_key = :key!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM stripe_prices WHERE lookup_key = :key!
 * ```
 */
export const getStripePriceByLookupKey = new PreparedQuery<
  IGetStripePriceByLookupKeyParams,
  IGetStripePriceByLookupKeyResult
>(getStripePriceByLookupKeyIR)
