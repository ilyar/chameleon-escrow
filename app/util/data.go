package util

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"image/jpeg"

	"golang.org/x/image/webp"
)

func MD5(data []byte) string {
	hasher := md5.New()
	_, _ = hasher.Write(data)

	return hex.EncodeToString(hasher.Sum(nil))
}

func ListContains(list []string, needle string) bool {
	for _, item := range list {
		if needle == item {
			return true
		}
	}
	return false
}

func ConvertWebpToJpg(data []byte, quality int) ([]byte, error) {
	result := new(bytes.Buffer)
	in := new(bytes.Buffer)
	in.Write(data)
	img, err := webp.Decode(in)
	if err != nil {
		return result.Bytes(), err
	}

	err = jpeg.Encode(result, img, &jpeg.Options{Quality: quality})
	if err != nil {
		return result.Bytes(), err
	}

	return result.Bytes(), nil
}
