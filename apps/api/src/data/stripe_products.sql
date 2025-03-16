/*
 @name UpsertStripeProduct
 @param product -> (id!, name!, description, active!, metadata)
*/
INSERT INTO stripe_products (id, name, description, active, metadata)
VALUES :product
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    active = EXCLUDED.active,
    metadata = EXCLUDED.metadata
RETURNING *;

/*
 @name DeleteStripeProduct
*/
DELETE FROM stripe_products WHERE id = :id!;

/*
 @name GetStripeProductById
*/
SELECT
  *
FROM stripe_products WHERE id = :id!;

/*
 @name GetStripeProductsWithPricesByStatus
*/
WITH
	active_products AS (
		SELECT
			*
		FROM
			stripe_products p
		WHERE
			active = :active!
	),
	products_without_prices AS (
		SELECT
			ap.id AS id,
			ap.name AS name,
			0 as unit_amount
		FROM
			active_products ap
			LEFT JOIN stripe_prices p ON p.product_id = ap.id
		WHERE
			p.product_id IS NULL
		GROUP BY ap.id, ap.name
	),
	products_with_prices AS (
		SELECT
			ap.id AS id,
			ap.name AS name,
			MIN(p.unit_amount) as unit_amount
		FROM
			active_products ap
			JOIN stripe_prices p ON p.product_id = ap.id
		GROUP BY ap.id, ap.name
	),
    sorted_products_with_prices AS (
        SELECT
            *
        FROM
            products_with_prices
        ORDER BY unit_amount ASC
    )

SELECT
  *
FROM sorted_products_with_prices

UNION ALL

SELECT
  *
FROM
    products_without_prices;
