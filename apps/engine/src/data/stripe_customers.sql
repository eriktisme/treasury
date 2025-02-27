/*
 @name UpsertStripeCustomer
 @param customer -> (id!, email!, name!, workspaceId!)
*/
INSERT INTO stripe_customers (id, email, name, workspace_id)
VALUES :customer
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    workspace_id = EXCLUDED.workspace_id
RETURNING *;

/*
 @name GetStripeCustomerByWorkspaceId
*/
SELECT
  *
FROM stripe_customers
WHERE workspace_id = :workspaceId!;
