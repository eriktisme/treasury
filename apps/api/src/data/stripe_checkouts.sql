/*
 @name GetStripeCheckoutById
*/
SELECT * FROM stripe_checkouts WHERE session_id = :id! AND workspace_id = :workspaceId!;

/*
 @name InsertStripeCheckout
 @param checkout -> (workspaceId!, sessionId!, customerId!, priceId!, mode!, status!, metadata, createdAt!)
 */
INSERT INTO stripe_checkouts (workspace_id, session_id, customer_id, price_id, mode, status,metadata, created_at)
VALUES :checkout
RETURNING *;
