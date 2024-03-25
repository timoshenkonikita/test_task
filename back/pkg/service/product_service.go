package service

import (
	"github.com/pla1no/web-server-test/api"
	"github.com/pla1no/web-server-test/pkg/repository"
)

type ProductItemService struct {
	repo repository.ProductItem
}

func NewProductItemService(repo repository.ProductItem) *ProductItemService {
	return &ProductItemService{
		repo: repo,
	}
}

func (s *ProductItemService) Create(product api.Product) (api.Product, error) {
	return s.repo.Create(product)
}

func (s *ProductItemService) GetAll() ([]api.Product, error) {
	return s.repo.GetAll()
}

func (s *ProductItemService) GetById(id int) (api.Product, error) {
	return s.repo.GetById(id)
}

func (s *ProductItemService) Delete(id int) error {
	return s.repo.Delete(id)
}

func (s *ProductItemService) Update(id int, input api.UpdateProductInput) error {
	if err := input.Validate(); err != nil {
		return err
	}
	return s.repo.Update(id, input)
}
