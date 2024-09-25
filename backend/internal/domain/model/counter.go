package model

type Counter struct {
	ID     uint   `gorm:"primaryKey"`
	Date   string `gorm:"unique;not null"`
	Number int    `gorm:"not null"`
}
