CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    name varchar(100) not null
);

CREATE TABLE accounts(
    id uuid DEFAULT uuid_generate_v4(),
    owner int not null,
    balance int default 0,
    FOREIGN KEY(owner) REFERENCES customers(id) ON DELETE CASCADE,
    PRIMARY KEY(id)
);

CREATE TABLE transactions(
    id uuid DEFAULT uuid_generate_v4(),
    "from" uuid not null,
    "to" uuid not null,
    amount int not null,
    created_at timestamptz not null,
    FOREIGN KEY("from") REFERENCES accounts(id),
    FOREIGN KEY("to") REFERENCES accounts(id),
    PRIMARY KEY(id)
);