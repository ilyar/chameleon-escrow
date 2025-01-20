package util_test

import (
	"io/ioutil"
	"testing"

	"github.com/ilyar/chameleon-escrow/app/util"
	"github.com/stretchr/testify/assert"
)

func TestMD5(t *testing.T) {
	actual := util.MD5([]byte("foo"))
	assert.Equal(t, "acbd18db4cc2f85cedef654fccc4a4d8", actual)
}

func TestListContains(t *testing.T) {
	assert.True(t, util.ListContains([]string{"foo"}, "foo"))
	assert.False(t, util.ListContains([]string{"foo"}, "bar"))
	assert.False(t, util.ListContains([]string{}, "bar"))
}

func TestConvertWebpToJpg(t *testing.T) {
	sourceData, err := ioutil.ReadFile("../testdata/storage-data/1x1.webp")
	assert.NoError(t, err)
	assert.NotEmpty(t, sourceData)

	expectedData, err := ioutil.ReadFile("../testdata/storage-data/1x1.jpg")
	assert.NoError(t, err)
	assert.NotEmpty(t, expectedData)

	actualData, err := util.ConvertWebpToJpg(sourceData, 100)
	assert.NoError(t, err)
	assert.NotEmpty(t, actualData)
	assert.Equal(t, expectedData, actualData)

	_, err = util.ConvertWebpToJpg([]byte("invalid_data"), 100)
	assert.Error(t, err)
}
