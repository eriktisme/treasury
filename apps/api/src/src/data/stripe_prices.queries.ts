/** Types generated for queries found in "src/src/data/stripe_prices.sql" */
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
  createdAt: Date
  currency: string | null
  id: string
  metadata: Json | null
  productId: string
  recurringCount: number | null
  recurringInterval: string | null
  unitAmount: number | null
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
        ],
      },
      locs: [{ a: 128, b: 133 }],
    },
  ],
  statement:
    'INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata)\nVALUES :price\nON CONFLICT (id) DO UPDATE SET\n    product_id = EXCLUDED.product_id,\n    unit_amount = EXCLUDED.unit_amount,\n    currency = EXCLUDED.currency,\n    recurring_interval = EXCLUDED.recurring_interval,\n    recurring_count = EXCLUDED.recurring_count,\n    active = EXCLUDED.active,\n    metadata = EXCLUDED.metadata\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata)
 * VALUES :price
 * ON CONFLICT (id) DO UPDATE SET
 *     product_id = EXCLUDED.product_id,
 *     unit_amount = EXCLUDED.unit_amount,
 *     currency = EXCLUDED.currency,
 *     recurring_interval = EXCLUDED.recurring_interval,
 *     recurring_count = EXCLUDED.recurring_count,
 *     active = EXCLUDED.active,
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
