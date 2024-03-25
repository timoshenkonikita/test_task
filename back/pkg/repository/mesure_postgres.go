package repository

import (
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pla1no/web-server-test/api"
)

type MeasurePostgres struct {
	db *sqlx.DB
}

func NewMeasurePostgres(db *sqlx.DB) *MeasurePostgres {
	return &MeasurePostgres{db: db}
}

func (r *MeasurePostgres) Create(measure api.Measure) (api.Measure, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return api.Measure{}, err
	}

	createMeasureQuery := fmt.Sprintf("INSERT INTO %s (value) VALUES ($1) RETURNING id, value", measureTable)
	row := tx.QueryRow(createMeasureQuery, measure.Value)
	if err := row.Scan(&measure.ID, &measure.Value); err != nil {
		tx.Rollback()
		return api.Measure{}, err
	}

	if err := tx.Commit(); err != nil {
		return api.Measure{}, err
	}

	return measure, nil
}

func (r *MeasurePostgres) GetAll() ([]api.Measure, error) {
	var measures []api.Measure

	query := fmt.Sprintf("SELECT * FROM %s", measureTable)
	err := r.db.Select(&measures, query)
	return measures, err
}

func (r *MeasurePostgres) GetById(id int) (api.Measure, error) {
	var measure api.Measure

	query := fmt.Sprintf("SELECT * FROM %s WHERE id = $1", measureTable)
	err := r.db.Get(&measure, query, id)
	return measure, err
}

func (r *MeasurePostgres) Delete(id int) error {
	// Проверка существования продукта с указанным идентификатором
	existsQuery := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE id = $1)", measureTable)
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
	deleteQuery := fmt.Sprintf("DELETE FROM %s WHERE id = $1", measureTable)

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

func (r *MeasurePostgres) Update(id int, input api.UpdateMeasureInput) error {
	// Проверка существования единицы измерения с указанным идентификатором
	existsQuery := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE id = $1)", measureTable)
	var exists bool
	err := r.db.Get(&exists, existsQuery, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("measure with id %d does not exist", id)
	}

	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argID := 1

	if input.Value != nil {
		setValues = append(setValues, fmt.Sprintf("value=$%d", argID))
		args = append(args, *input.Value)
		argID++
	}

	setQuery := strings.Join(setValues, ", ")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d", measureTable, setQuery, argID)

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}
