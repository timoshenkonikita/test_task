-- Создание таблицы единиц измерения
CREATE TABLE IF NOT EXISTS measures (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);

-- Создание таблицы продуктов
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_cost INT NOT NULL,
    measure_id INT,
    FOREIGN KEY (measure_id) REFERENCES measures(id)
);