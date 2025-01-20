package storage

import (
	"os"
	"path/filepath"

	"github.com/ilyar/chameleon-escrow/app/util"
)

type FileStorage struct {
	path string
}

func NewFileStorage(path string) *FileStorage {
	return &FileStorage{path}
}

func (o *FileStorage) FullPath(name string) string {
	return filepath.Join(o.path, parseName(name))
}

func (o *FileStorage) Get(name string) ([]byte, error) {
	data, err := os.ReadFile(o.FullPath(name))

	return data, err
}

func (o *FileStorage) Set(name string, data []byte) (string, error) {
	err := os.WriteFile(o.FullPath(name), data, 0644)

	return o.FullPath(name), err
}

func (o *FileStorage) Has(name string) bool {
	info, err := os.Stat(o.FullPath(name))
	if os.IsNotExist(err) {
		return false
	}

	return !info.IsDir()
}

func (o *FileStorage) Remove(name string) error {
	return os.Remove(o.FullPath(name))
}

func (o *FileStorage) MD5(name string) string {
	data, err := o.Get(name)
	if err != nil {
		return ""
	}

	return util.MD5(data)
}

func (o *FileStorage) Rename(from, to string) error {
	return os.Rename(o.FullPath(from), o.FullPath(to))
}

func (o *FileStorage) List() []string {
	files, err := os.ReadDir(o.path)
	if err != nil {
		return nil
	}

	result := make([]string, len(files))
	for i, file := range files {
		result[i] = file.Name()
	}

	return result
}
