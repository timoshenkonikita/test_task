package repository

import (
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pla1no/web-server-test/api"
)

type ProductItemPostgres struct {
	db *sqlx.DB
}

func NewProductItemPostgres(db *sqlx.DB) *ProductItemPostgres {
	return &ProductItemPostgres{db: db}
}

func (r *ProductItemPostgres) Create(product api.Product) (api.Product, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return api.Product{}, err
	}

	createProductQuery := fmt.Sprintf("INSERT INTO %s (name, quantity, unit_cost, measure_id) VALUES ($1, $2, $3, $4) RETURNING id, name, quantity, unit_cost, measure_id", productTable)
	row := tx.QueryRow(createProductQuery, product.Name, product.Quantity, product.UnitCost, product.MeasureID)
	if err := row.Scan(&product.ID, &product.Name, &product.Quantity, &product.UnitCost, &product.MeasureID); err != nil {
		tx.Rollback()
		return api.Product{}, err
	}

	if err := tx.Commit(); err != nil {
		return api.Product{}, err
	}

	return product, nil
}

func (r *ProductItemPostgres) GetAll() ([]api.Product, error) {
	var products []api.Product

	query := fmt.Sprintf("SELECT * FROM %s", productTable)
	err := r.db.Select(&products, query)
	return products, err
}

func (r *ProductItemPostgres) GetById(id int) (api.Product, error) {
	var product api.Product

	query := fmt.Sprintf("SELECT * FROM %s WHERE id = $1", productTable)
	err := r.db.Get(&product, query, id)
	return product, err
}

func (r *ProductItemPostgres) Delete(id int) error {
	// Проверка существования продукта с указанным идентификатором
	existsQuery := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE id = $1)", productTable)
	var exists bool
	err := r.db.Get(&exists, existsQuery, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("item with id %d does not exist", id)
	}

	// Начало транзакции
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// SQL запрос для удаления продукта по идентификатору
	deleteQuery := fmt.Sprintf("DELETE FROM %s WHERE id = $1", productTable)

	// Выполнение SQL запроса
	_, err = tx.Exec(deleteQuery, id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Фиксация транзакции
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *ProductItemPostgres) Update(id int, input api.UpdateProductInput) error {
	// Проверка существования продукта с указанным идентификатором
	existsQuery := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE id = $1)", productTable)
	var exists bool
	err := r.db.Get(&exists, existsQuery, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("item with id %d does not exist", id)
	}

	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argID := 1

	if input.Name != nil {
		setValues = append(setValues, fmt.Sprintf("name=$%d", argID))
		args = append(args, *input.Name)
		argID++
	}

	if input.Quantity != nil {
		setValues = append(setValues, fmt.Sprintf("quantity=$%d", argID))
		args = append(args, *input.Quantity)
		argID++
	}

	if input.UnitCost != nil {
		setValues = append(setValues, fmt.Sprintf("unit_cost=$%d", argID))
		args = append(args, *input.UnitCost)
		argID++
	}

	if input.MeasureID != nil {
		setValues = append(setValues, fmt.Sprintf("measure_id=$%d", argID))
		args = append(args, *input.MeasureID)
		argID++
	}

	setQuery := strings.Join(setValues, ", ")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d", productTable, setQuery, argID)

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}
