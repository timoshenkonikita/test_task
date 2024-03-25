package service

import (
	"github.com/pla1no/web-server-test/api"
	"github.com/pla1no/web-server-test/pkg/repository"
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

type Service struct {
	ProductItem
	MeasureItem
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		ProductItem: NewProductItemService(repos.ProductItem),
		MeasureItem: NewMeasureService(repos.MeasureItem),
	}
}
