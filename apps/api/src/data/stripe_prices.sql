/*
 @name UpsertStripePrice
 @param price -> (id!, productId!, unitAmount, currency, recurringInterval, recurringCount, active!, metadata)
*/
INSERT INTO stripe_prices (id, product_id, unit_amount, currency, recurring_interval, recurring_count, active, metadata)
VALUES :price
ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    unit_amount = EXCLUDED.unit_amount,
    currency = EXCLUDED.currency,
    recurring_interval = EXCLUDED.recurring_interval,
    recurring_count = EXCLUDED.recurring_count,
    active = EXCLUDED.active,
    metadata = EXCLUDED.metadata
RETURNING *;

/*
 @name DeleteStripePrice
*/
DELETE FROM stripe_prices WHERE id = :id!;
