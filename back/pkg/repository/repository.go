package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/pla1no/web-server-test/api"
)

type ProductItem interface {
	Create(api.Product) (api.Product, error)
	GetAll() ([]api.Product, error)
	GetById(id int) (api.Product, error)
	Delete(id int) error
	Update(id int, product api.UpdateProductInput) error
}

type MeasureItem interface {
	Create(api.Measure) (api.Measure, error)
	GetAll() ([]api.Measure, error)
	GetById(id int) (api.Measure, error)
	Delete(id int) error
	Update(id int, measure api.UpdateMeasureInput) error
}

type Repository struct {
	ProductItem
	MeasureItem
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		ProductItem: NewProductItemPostgres(db),
		MeasureItem: NewMeasurePostgres(db),
	}
}
