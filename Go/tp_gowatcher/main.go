package main

import "github.com/JongCHONG/tp_gowatcher/cmd"

// pour créer l'exécutable, il faut utiliser la commande suivante
// go build -o gowatch
// ./gowatcher check --input urls.json --output report.json

func main() {
	cmd.Execute()

	// Create a channel to receive results from the checker
	// results := make(chan checker.CheckResult)

	// for range targets {
	// 	result := <-results
	// 	if result.Err != nil {
	// 		fmt.Printf("KO %s :erreur : %v\n", result.Target, result.Err)
	// 	} else {
	// 		fmt.Printf("OK %s :%s\n", result.Target, result.Status)
	// 	}
	// }
	// close(results)

}
