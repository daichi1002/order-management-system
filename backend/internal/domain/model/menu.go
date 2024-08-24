package model

import "gorm.io/gorm"

type Menu struct {
    gorm.Model
    Name      string          `json:"name"`
    Price     float64         `json:"price"`
    Available bool            `json:"available"`
    DeletedAt gorm.DeletedAt  `json:"deleted_at"`
}
