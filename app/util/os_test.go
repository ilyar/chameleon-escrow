package util_test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/ilyar/chameleon-escrow/app/util"
)

func TestGetEnv(t *testing.T) {
	assert.Equal(t, "foo", util.GetEnv("ENV_VAR", "foo"))
	_ = os.Setenv("ENV_VAR", "bar")
	assert.Equal(t, "bar", util.GetEnv("ENV_VAR", "foo"))
}

func TestGetEnvInt(t *testing.T) {
	assert.Equal(t, 1, util.GetEnvInt("ENV_VAR_INT", 1))
	_ = os.Setenv("ENV_VAR_INT", "10")
	assert.Equal(t, 10, util.GetEnvInt("ENV_VAR_INT", 1))
}

func TestIsValidDir(t *testing.T) {
	assert.False(t, util.IsValidDir("notExist"))
	assert.True(t, util.IsValidDir("../testdata"))
}

func TestCreateIfNoExist(t *testing.T) {
	assert.NotNil(t, util.CreateDirIfNoExist("../testdata/storage-data/test_1.csv"))
	assert.Nil(t, util.CreateDirIfNoExist("../testdata/foo/bar"))
	_ = os.RemoveAll("../testdata/foo")
}
