/*
 @name UpsertStripeSubscription
 @param subscription -> (workspaceId!, id!, customerId!, priceId!, currentPeriodStart!, currentPeriodEnd!, status!, quantity!, metadata, trialPeriodStart, trialPeriodEnd, canceledAt, canceledAtPeriodEnd, createdAt!)
*/
INSERT INTO stripe_subscriptions (workspace_id, id, customer_id, price_id, current_period_start, current_period_end, status, quantity, metadata, trial_period_start, trial_period_end, canceled_at, canceled_at_period_end, created_at)
VALUES :subscription
ON CONFLICT (id) DO UPDATE SET
    customer_id = EXCLUDED.customer_id,
    price_id = EXCLUDED.price_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    status = EXCLUDED.status,
    quantity = EXCLUDED.quantity,
    metadata = EXCLUDED.metadata,
    trial_period_start = EXCLUDED.trial_period_start,
    trial_period_end = EXCLUDED.trial_period_end,
    canceled_at = EXCLUDED.canceled_at,
    canceled_at_period_end = EXCLUDED.canceled_at_period_end
RETURNING *;

/*
 @name DeleteStripeSubscription
*/
DELETE FROM stripe_subscriptions WHERE id = :id!;

/*
 @name GetStripeSubscriptionById
*/
SELECT * FROM stripe_subscriptions WHERE id = :id!;

/*
 @name GetStripeSubscriptionsByWorkspaceId
*/
SELECT
  s.*,
  product.id as product_id
FROM stripe_subscriptions s
JOIN stripe_prices price ON s.price_id = price.id
JOIN stripe_products product ON price.product_id = product.id
WHERE s.workspace_id = :workspaceId!;

/*
 @name GetCurrentStripeSubscriptionsByWorkspaceId
*/
SELECT
  s.*,
  product.id as product_id
FROM stripe_subscriptions s
JOIN stripe_prices price ON s.price_id = price.id
JOIN stripe_products product ON price.product_id = product.id
WHERE s.workspace_id = :workspaceId!
AND (s.canceled_at IS NULL OR s.canceled_at <= NOW())
ORDER BY s.current_period_start ASC
LIMIT 1;
