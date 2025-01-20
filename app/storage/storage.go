package storage

import (
	"log"
	"net/url"
	"os"
	"strings"
)

type Storage interface {
	Get(name string) ([]byte, error)
	Set(name string, data []byte) (string, error)
	Has(name string) bool
	Remove(name string) error
	Rename(from, to string) error
	FullPath(name string) string
	MD5(name string) string
	List() []string
}

func NewStorage(address string) Storage {
	u, err := url.Parse(address)
	if err != nil {
		log.Fatalf("can't parse address sorage '%s'", address)
	}
	return NewFileStorage(address)
}

func parseName(name string) string {
	return strings.Trim(name, string(os.PathSeparator))
}
