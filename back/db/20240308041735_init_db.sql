-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS measures (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_cost INT NOT NULL,
    measure_id INT,
    FOREIGN KEY (measure_id) REFERENCES measures(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS measures;
DROP TABLE IF EXISTS products;
-- +goose StatementEnd
