-- Up Migration
CREATE TABLE stripe_products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL,
    metadata JSON,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE stripe_prices (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL REFERENCES stripe_products ON DELETE CASCADE,
    unit_amount INT,
    currency VARCHAR(3),
    recurring_interval VARCHAR(50),
    recurring_count INT,
    active BOOLEAN NOT NULL,
    metadata JSON,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE stripe_prices ADD COLUMN lookup_key VARCHAR(255);

CREATE TABLE stripe_customers (
    workspace_id VARCHAR NOT NULL UNIQUE,
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE stripe_subscriptions (
    workspace_id VARCHAR NOT NULL UNIQUE,
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL REFERENCES stripe_customers ON DELETE CASCADE,
    price_id VARCHAR(255) NOT NULL REFERENCES stripe_prices ON DELETE CASCADE,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_period_start TIMESTAMP WITH TIME ZONE,
    trial_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    canceled_at_period_end TIMESTAMP WITH TIME ZONE,
    status VARCHAR,
    quantity int,
    metadata JSON,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE stripe_checkouts (
    workspace_id VARCHAR NOT NULL,
    session_id VARCHAR(255) PRIMARY KEY,
    price_id VARCHAR(255) NOT NULL REFERENCES stripe_prices ON DELETE CASCADE,
    customer_id VARCHAR(255) NOT NULL REFERENCES stripe_customers ON DELETE CASCADE,
    status VARCHAR(50),
    metadata JSON,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE stripe_customers
ADD COLUMN tax_id VARCHAR(255);

ALTER TABLE stripe_checkouts
ADD COLUMN "mode" VARCHAR(255) NOT NULL;

ALTER TABLE stripe_subscriptions
DROP CONSTRAINT stripe_subscriptions_workspace_id_key;

-- Down Migration
DROP TABLE stripe_products;
DROP TABLE stripe_prices;
DROP TABLE stripe_checkouts;
DROP TABLE stripe_subscriptions;
DROP TABLE stripe_customers;
