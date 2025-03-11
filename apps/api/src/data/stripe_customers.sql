/*
 @name GetStripeCustomerByWorkspaceId
*/
SELECT * FROM stripe_customers WHERE workspace_id = :workspaceId!;

/*
 @name GetStripeCustomerById
*/
SELECT * FROM stripe_customers WHERE id = :id!;

/*
 @name UpdateStripeCustomerById
*/
UPDATE stripe_customers
SET
  name = :name!,
  tax_id = :taxId!,
  email = :email!,
  description = :description!,
  phone = :phone!
WHERE id = :id!
RETURNING *;
