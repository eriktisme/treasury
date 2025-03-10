/*
 @name GetStripeCheckoutByIdAndWorkspaceId
*/
SELECT * FROM stripe_checkouts WHERE session_id = :id! AND workspace_id = :workspaceId!;

/*
 @name GetStripeCheckoutById
*/
SELECT * FROM stripe_checkouts WHERE session_id = :id!;

/*
 @name InsertStripeCheckout
 @param checkout -> (workspaceId!, sessionId!, customerId!, priceId!, mode!, status!, metadata, createdAt!)
 */
INSERT INTO stripe_checkouts (workspace_id, session_id, customer_id, price_id, mode, status,metadata, created_at)
VALUES :checkout
RETURNING *;

/*
 @name UpdateStripeCheckoutStatus
 */
UPDATE stripe_checkouts
SET status = :status!
WHERE session_id = :sessionId!
RETURNING *;
