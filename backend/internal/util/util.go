package util

import "time"

var NowFunc func() time.Time

func init() {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		panic(err)
	}

	NowFunc = func() time.Time {
		return time.Now().In(jst)
	}
}
