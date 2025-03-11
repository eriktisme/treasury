/** Types generated for queries found in "src/data/stripe_products.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** 'UpsertStripeProduct' parameters type */
export interface IUpsertStripeProductParams {
  product: {
    active: boolean
    description: string | null | void
    id: string
    metadata: Json | null | void
    name: string
  }
}

/** 'UpsertStripeProduct' return type */
export interface IUpsertStripeProductResult {
  active: boolean
  created_at: Date
  description: string | null
  id: string
  metadata: Json | null
  name: string
}

/** 'UpsertStripeProduct' query type */
export interface IUpsertStripeProductQuery {
  params: IUpsertStripeProductParams
  result: IUpsertStripeProductResult
}

const upsertStripeProductIR: any = {
  usedParamSet: { product: true },
  params: [
    {
      name: 'product',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'id', required: true },
          { name: 'name', required: true },
          { name: 'description', required: false },
          { name: 'active', required: true },
          { name: 'metadata', required: false },
        ],
      },
      locs: [{ a: 77, b: 84 }],
    },
  ],
  statement:
    'INSERT INTO stripe_products (id, name, description, active, metadata)\nVALUES :product\nON CONFLICT (id) DO UPDATE SET\n    name = EXCLUDED.name,\n    description = EXCLUDED.description,\n    active = EXCLUDED.active,\n    metadata = EXCLUDED.metadata\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO stripe_products (id, name, description, active, metadata)
 * VALUES :product
 * ON CONFLICT (id) DO UPDATE SET
 *     name = EXCLUDED.name,
 *     description = EXCLUDED.description,
 *     active = EXCLUDED.active,
 *     metadata = EXCLUDED.metadata
 * RETURNING *
 * ```
 */
export const upsertStripeProduct = new PreparedQuery<
  IUpsertStripeProductParams,
  IUpsertStripeProductResult
>(upsertStripeProductIR)

/** 'DeleteStripeProduct' parameters type */
export interface IDeleteStripeProductParams {
  id: string
}

/** 'DeleteStripeProduct' return type */
export type IDeleteStripeProductResult = void

/** 'DeleteStripeProduct' query type */
export interface IDeleteStripeProductQuery {
  params: IDeleteStripeProductParams
  result: IDeleteStripeProductResult
}

const deleteStripeProductIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 39, b: 42 }],
    },
  ],
  statement: 'DELETE FROM stripe_products WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM stripe_products WHERE id = :id!
 * ```
 */
export const deleteStripeProduct = new PreparedQuery<
  IDeleteStripeProductParams,
  IDeleteStripeProductResult
>(deleteStripeProductIR)
