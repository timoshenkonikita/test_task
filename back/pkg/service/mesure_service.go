package service

import (
	"github.com/pla1no/web-server-test/api"
	"github.com/pla1no/web-server-test/pkg/repository"
)

type MeasureService struct {
	repo repository.MeasureItem
}

func NewMeasureService(repo repository.MeasureItem) *MeasureService {
	return &MeasureService{
		repo: repo,
	}
}

func (s *MeasureService) Create(measure api.Measure) (api.Measure, error) {
	return s.repo.Create(measure)
}

func (s *MeasureService) GetAll() ([]api.Measure, error) {
	return s.repo.GetAll()
}

func (s *MeasureService) GetById(id int) (api.Measure, error) {
	return s.repo.GetById(id)
}

func (s *MeasureService) Delete(id int) error {
	return s.repo.Delete(id)
}

func (s *MeasureService) Update(id int, input api.UpdateMeasureInput) error {
	if err := input.Validate(); err != nil {
		return err
	}
	return s.repo.Update(id, input)
}
