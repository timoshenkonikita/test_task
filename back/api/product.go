package api

import "errors"

type Product struct {
	ID        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Quantity  int    `json:"quantity" db:"quantity"`
	UnitCost  int    `json:"unit_cost" db:"unit_cost"`
	MeasureID int    `json:"measure_id" db:"measure_id"`
}

type UpdateProductInput struct {
	Name      *string `json:"name"`
	Quantity  *int    `json:"quantity"`
	UnitCost  *int    `json:"unit_cost"`
	MeasureID *int    `json:"measure_id"`
}

func (u UpdateProductInput) Validate() error {
	if u.Name == nil || u.Quantity == nil || u.UnitCost == nil || u.MeasureID == nil {
		return errors.New("validation error")
	}

	return nil
}
