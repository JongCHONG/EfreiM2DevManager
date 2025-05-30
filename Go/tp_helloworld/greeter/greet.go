package greeter

import "fmt"

type Language string

var phraseBook = map[Language]string{
	"fr": "Bonjour, le monde!",
	"en": "Hello, World!",
}

func Greet(l Language) (string, error) { // "G" for exportable function
	greeting, ok := phraseBook[l]
	if !ok {
		return "", fmt.Errorf("no greeting available for language: %s", l)
	}
	return greeting, nil
}
