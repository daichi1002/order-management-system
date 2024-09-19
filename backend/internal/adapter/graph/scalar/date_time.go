package scalar

import (
	"fmt"
	"io"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type DateTime time.Time

// MarshalDateTime シリアライズ関数: Go の DateTime を ISO 8601 形式の文字列に変換
func MarshalDateTime(t DateTime) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		// JSTタイムゾーンを設定
		loc, _ := time.LoadLocation("Asia/Tokyo")
		jstTime := time.Time(t).In(loc)
		_, _ = io.WriteString(w, fmt.Sprintf("%q", jstTime.Format(time.RFC3339)))
	})
}

// UnmarshalDateTime デシリアライズ関数: ISO 8601 形式の文字列を Go の DateTime に変換
func UnmarshalDateTime(v interface{}) (DateTime, error) {
	switch v := v.(type) {
	case string:
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return DateTime{}, err
		}

		loc, err := time.LoadLocation("Asia/Tokyo")
		if err != nil {
			return DateTime{}, fmt.Errorf("failed to load location: %v", err)
		}
		jstTime := time.Time(t).In(loc)

		return DateTime(jstTime), nil
	default:
		return DateTime{}, fmt.Errorf("invalid datetime format")
	}
}

func TimeToDateTime(t time.Time) DateTime {
	return DateTime(t)
}
