package storage_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/ilyar/chameleon-escrow/app/storage"
)

func TestHasDir(t *testing.T) {
	s := storage.NewStorage("../../testdata")
	assert.False(t, s.Has("storage-test"))
}

func TestListNotExist(t *testing.T) {
	s := storage.NewStorage("../../notExist")
	assert.Nil(t, s.List())
}

func TestList(t *testing.T) {
	s := storage.NewStorage("../../testdata/storage-test")
	assert.Len(t, s.List(), 1)
}

func TestMD5(t *testing.T) {
	s := storage.NewStorage("../../testdata/storage-test")
	assert.Equal(t, "acbd18db4cc2f85cedef654fccc4a4d8", s.MD5("test"))
	assert.Equal(t, "", s.MD5("notExist"))
}

func TestRename(t *testing.T) {
	s := storage.NewStorage("../../testdata/storage-data")
	_, _ = s.Set("a-local", []byte(""))
	assert.True(t, s.Has("a-local"))
	assert.False(t, s.Has("b-local"))
	assert.Nil(t, s.Rename("a-local", "b-local"))
	assert.False(t, s.Has("a-local"))
	assert.True(t, s.Has("b-local"))
	assert.Nil(t, s.Rename("b-local", "a-local"))
}

func TestRemove(t *testing.T) {
	s := storage.NewStorage("../../testdata/storage-data")
	_, err := s.Set("a-local", []byte(""))
	assert.NoError(t, err)
	assert.True(t, s.Has("a-local"))

	err = s.Remove("a-local")
	assert.NoError(t, err)
	assert.False(t, s.Has("a-local"))
}
