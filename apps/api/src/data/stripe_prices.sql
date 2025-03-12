/*
 @name UpsertStripePrice
 @param price -> (id!, productId!, unitAmount, currency, recurringInterval, recurringCount, active!, metadata, lookupKey)
*/
INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata, lookup_key)
VALUES :price
ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    unit_amount = EXCLUDED.unit_amount,
    currency = EXCLUDED.currency,
    recurring_interval = EXCLUDED.recurring_interval,
    recurring_count = EXCLUDED.recurring_count,
    active = EXCLUDED.active,
    lookup_key = EXCLUDED.lookup_key,
    metadata = EXCLUDED.metadata
RETURNING *;

/*
 @name DeleteStripePrice
*/
DELETE FROM stripe_prices WHERE id = :id!;

/*
 @name GetStripePriceById
*/
SELECT * FROM stripe_prices WHERE id = :id!;

/*
 @name GetStripePriceByProductIds
 @param productIds -> (...)
*/
SELECT * FROM stripe_prices WHERE product_id IN :productIds!;

/*
 @name GetStripePriceByLookupKey
*/
SELECT * FROM stripe_prices WHERE lookup_key = :key!;
