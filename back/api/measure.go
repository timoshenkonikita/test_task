package api

import "errors"

type Measure struct {
	ID    int    `json:"id" db:"id"`
	Value string `json:"value" db:"value"`
}

type UpdateMeasureInput struct {
	Value *string `json:"value"`
}

func (u UpdateMeasureInput) Validate() error {
	if u.Value == nil {
		return errors.New("validation error")
	}
	return nil
}
