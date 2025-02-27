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
