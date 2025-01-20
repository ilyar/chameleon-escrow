package util

import (
	"os"
	"strconv"
)

// GetEnv returns the environment string variables specified key in this machine
func GetEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

// GetEnvInt returns the environment integer variables specified key in this machine
func GetEnvInt(key string, fallback int) int {
	value, err := strconv.Atoi(GetEnv(key, string(rune(fallback))))
	if err != nil {
		return fallback
	}

	return value
}

// IsValidDir indicates existence of directory MediaPath in this machine
func IsValidDir(path string) bool {
	fi, err := os.Stat(path)
	if fi == nil || os.IsNotExist(err) {
		return false
	}

	return fi.Mode().IsDir()
}

// CreateDirIfNoExist check valid folder or try create it
func CreateDirIfNoExist(path string) error {
	if !IsValidDir(path) {
		err := os.MkdirAll(path, 0770)
		if err != nil {
			return err
		}
	}

	return nil
}
