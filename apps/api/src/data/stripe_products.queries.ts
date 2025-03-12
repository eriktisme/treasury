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

/** 'GetStripeProductById' parameters type */
export interface IGetStripeProductByIdParams {
  id: string
}

/** 'GetStripeProductById' return type */
export interface IGetStripeProductByIdResult {
  active: boolean
  created_at: Date
  description: string | null
  id: string
  metadata: Json | null
  name: string
}

/** 'GetStripeProductById' query type */
export interface IGetStripeProductByIdQuery {
  params: IGetStripeProductByIdParams
  result: IGetStripeProductByIdResult
}

const getStripeProductByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 43, b: 46 }],
    },
  ],
  statement: 'SELECT\n  *\nFROM stripe_products WHERE id = :id!',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM stripe_products WHERE id = :id!
 * ```
 */
export const getStripeProductById = new PreparedQuery<
  IGetStripeProductByIdParams,
  IGetStripeProductByIdResult
>(getStripeProductByIdIR)

/** 'GetStripeProductsWithPricesByStatus' parameters type */
export interface IGetStripeProductsWithPricesByStatusParams {
  active: boolean
}

/** 'GetStripeProductsWithPricesByStatus' return type */
export interface IGetStripeProductsWithPricesByStatusResult {
  id: string | null
  name: string | null
  unit_amount: number | null
}

/** 'GetStripeProductsWithPricesByStatus' query type */
export interface IGetStripeProductsWithPricesByStatusQuery {
  params: IGetStripeProductsWithPricesByStatusParams
  result: IGetStripeProductsWithPricesByStatusResult
}

const getStripeProductsWithPricesByStatusIR: any = {
  usedParamSet: { active: true },
  params: [
    {
      name: 'active',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 89, b: 96 }],
    },
  ],
  statement:
    'WITH\n\tactive_products AS (\n\t\tSELECT\n\t\t\t*\n\t\tFROM\n\t\t\tstripe_products p\n\t\tWHERE\n\t\t\tactive = :active!\n\t),\n\tproducts_without_prices AS (\n\t\tSELECT\n\t\t\tap.id AS id,\n\t\t\tap.name AS name,\n\t\t\t0 as unit_amount\n\t\tFROM\n\t\t\tactive_products ap\n\t\t\tLEFT JOIN stripe_prices p ON p.product_id = ap.id\n\t\tWHERE\n\t\t\tp.product_id IS NULL\n\t\tGROUP BY ap.id, ap.name\n\t),\n\tproducts_with_prices AS (\n\t\tSELECT\n\t\t\tap.id AS id,\n\t\t\tap.name AS name,\n\t\t\tMIN(p.unit_amount) as unit_amount\n\t\tFROM\n\t\t\tactive_products ap\n\t\t\tJOIN stripe_prices p ON p.product_id = ap.id\n\t\tGROUP BY ap.id, ap.name\n\t)\n\nSELECT\n\t*\nFROM\n\tproducts_with_prices\n\nUNION ALL\n\nSELECT\n\t*\nFROM\n\tproducts_without_prices',
}

/**
 * Query generated from SQL:
 * ```
 * WITH
 * 	active_products AS (
 * 		SELECT
 * 			*
 * 		FROM
 * 			stripe_products p
 * 		WHERE
 * 			active = :active!
 * 	),
 * 	products_without_prices AS (
 * 		SELECT
 * 			ap.id AS id,
 * 			ap.name AS name,
 * 			0 as unit_amount
 * 		FROM
 * 			active_products ap
 * 			LEFT JOIN stripe_prices p ON p.product_id = ap.id
 * 		WHERE
 * 			p.product_id IS NULL
 * 		GROUP BY ap.id, ap.name
 * 	),
 * 	products_with_prices AS (
 * 		SELECT
 * 			ap.id AS id,
 * 			ap.name AS name,
 * 			MIN(p.unit_amount) as unit_amount
 * 		FROM
 * 			active_products ap
 * 			JOIN stripe_prices p ON p.product_id = ap.id
 * 		GROUP BY ap.id, ap.name
 * 	)
 *
 * SELECT
 * 	*
 * FROM
 * 	products_with_prices
 *
 * UNION ALL
 *
 * SELECT
 * 	*
 * FROM
 * 	products_without_prices
 * ```
 */
export const getStripeProductsWithPricesByStatus = new PreparedQuery<
  IGetStripeProductsWithPricesByStatusParams,
  IGetStripeProductsWithPricesByStatusResult
>(getStripeProductsWithPricesByStatusIR)
