package util

import (
	log "github.com/sirupsen/logrus"
)

func ExitIfFalse(ok bool, v ...interface{}) {
	if !ok {
		log.Fatalln(v...)
	} else if len(v) > 0 {
		log.Trace(v...)
	}
}

func ExitIfError(err error, v ...interface{}) {
	if err != nil {
		log.Fatalln(v, err)
	} else if len(v) > 0 {
		log.Trace(v...)
	}
}
