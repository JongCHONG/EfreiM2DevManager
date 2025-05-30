package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/JongCHONG/tp1_helloworld/greeter"
)

func main() {
	var lang string
	flag.StringVar(&lang, "lang", "en", "('en' for English, 'fr' for French)")
	flag.Parse()
	// command : go run main.go --lang="fr"

	greeting, err := greeter.Greet(greeter.Language(lang)) // create a var and type it
	if err != nil {
		log.Fatalf("Error: %v", err) // log.Fatalf will print the error and exit the program
		return
	}
	fmt.Println(greeting)
}

// var m map[language]string
// m := make(map[language]string)
// m := map[language]string{
// 	"fr": "Bonjour, le monde!",
// 	"en": "Hello, World!",
// }
// v:= m["a"]
// m["a"] = valeur
// v, ok := m["a"] // ok is a boolean that indicates if the key exists
// delete(m, "a") // delete a key-value pair
// length := len(m) // get the number of key-value pairs

// func greet(l language) string {
// 	switch l {
// 	case "fr":
// 		return "Bonjour, le monde!"
// 	case "en":
// 		return "Hello, World!"
// 	default:
// 		return ""
// 	}
// }
