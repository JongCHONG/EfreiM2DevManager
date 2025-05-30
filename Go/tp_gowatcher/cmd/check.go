package cmd

// Pour pouvoir utiliser cobra, il faut l'installer
// go get -u github.com/spf13/cobra@latest

import (
	"errors"
	"fmt"
	"sync"

	"github.com/JongCHONG/tp_gowatcher/internal/checker"
	"github.com/JongCHONG/tp_gowatcher/internal/config"
	"github.com/JongCHONG/tp_gowatcher/internal/reporter"
	"github.com/spf13/cobra"
)

var (
	inputFilePath  string // Path to the input file containing URLs to check
	outputFilePath string // Path to the output file for saving the report (if needed, not used in this example)
)

var CheckCmd = &cobra.Command{
	Use:   "check",
	Short: "Check the availability of a list of URLs",
	Long:  "Check the availability of a list of URLs by making HTTP GET requests and printing the results.",
	Run: func(cmd *cobra.Command, args []string) {
		// targets := []string{
		// 	"https://www.google.com",
		// 	"https://www.notarealwebsite.abc",
		// 	"https://github.com",
		// 	"https://www.movie.database/film/details",
		// 	"https://www.gaming.news/release/new-game",
		// 	"https://www.health.clinic/appointment/online",
		// 	"https://www.car.manufacturer/model/electric",
		// 	"https://www.home.decor/ideas/living-room",
		// 	"https://www.environmental.org/project/clean-water",
		// 	"https://www.space.agency/mission/mars",
		// 	"https://www.fashion.magazine/trend/summer",
		// 	"https://www.tech.conference/schedule/day1",
		// 	"https://www.food.blog/recipe/dessert",
		// 	"https://www.online.course/programming/python",
		// 	"https://www.travel.guide/city/paris",
		// 	"https://www.music.label/artist/new-album",
		// 	"https://www.sports.club/events/match",
		// 	"https://www.photography.tips/technique/lighting",
		// 	"https://www.diy.tools/review/drill",
		// 	"https://www.pet.vet/service/vaccination",
		// 	"https://www.gardening.store/seeds/flower",
		// 	"https://www.finance.advice/retirement/planning",
		// 	"https://www.history.podcast/episode/ww2",
		// 	"https://www.language.exchange/partner/find",
		// 	"https://www.book.review/author/classic",
		// 	"https://www.movie.review/genre/comedy",
		// 	"https://www.gaming.forum/topic/strategy",
		// }

		// Check if the input file path is provided
		if inputFilePath == "" {
			fmt.Println("Error: Input file path is required. Use --input or -i flag to specify the file containing URLs.")
			return
		}

		// Check if the input file exists
		targets, err := config.LoadTargetsFromFile(inputFilePath)
		if err != nil {
			fmt.Printf("Error loading targets from file: %v\n", err)
			return
		}

		// Check if there are any targets to process
		if len(targets) == 0 {
			fmt.Println("No URLs found in the input file.")
			return
		}

		// Send data to the channel
		var wg sync.WaitGroup
		resultsChan := make(chan checker.CheckResult, len(targets))

		wg.Add(len(targets))
		for _, target := range targets {
			go func(t config.InputTarget) {
				result := checker.CheckURL(t)
				resultsChan <- result
				defer wg.Done()
			}(target)
		}
		wg.Wait()
		close(resultsChan)

		// Collect results from the channel and convert them to report entries
		var finalReport []checker.ReportEntry
		for result := range resultsChan {
			reportEntry := checker.ConvertToReportEntry(result)
			finalReport = append(finalReport, reportEntry)
			if result.Err != nil {
				var unreachable *checker.UnreachableURLError
				if errors.As(result.Err, &unreachable) {
					fmt.Printf("KO %s : Inaccessible URL: %s\n", result.InputTarget.URL, unreachable.Err)
				} else {
					fmt.Printf("KO %s : Error: %v\n", result.InputTarget.URL, result.Err)
				}
			} else {
				fmt.Printf("OK %s : %s\n", result.InputTarget.URL, result.Status)
			}
		}

		if outputFilePath != "" {
			// Save the final report to a file
			err := reporter.ExportResultsToJsonFile(outputFilePath, finalReport)
			if err != nil {
				fmt.Printf("Error saving report to file: %v\n", err)
			} else {
				fmt.Printf("Report saved to %s\n", outputFilePath)
			}
		}
		// Create a WaitGroup to wait for all goroutines to finish
		// var wg sync.WaitGroup
		// // Set the number of goroutines to wait for
		// wg.Add(len(targets))

		// // _ is index variable, we don't need it
		// for _, url := range targets {
		// 	go func(u string) {
		// 		result := checker.CheckURL(u)
		// 		// done is used to signal that this goroutine is finished wg -1
		// 		defer wg.Done()
		// 		if result.Err != nil {
		// 			fmt.Printf("KO %s :erreur : %v\n", result.Target, result.Err)
		// 		} else {
		// 			fmt.Printf("OK %s :%s\n", result.Target, result.Status)
		// 		}
		// 	}(url)

		// }
		// wg.Wait()
	},
}

func init() {
	// Add the CheckCmd to the root command
	rootCmd.AddCommand(CheckCmd)

	// You can add flags specific to the check command here if needed
	CheckCmd.Flags().StringVarP(&inputFilePath, "input", "i", "", "Path to the input file containing URLs to check (default is stdin)")
	CheckCmd.Flags().StringVarP(&outputFilePath, "output", "o", "", "Path to the output file for saving the report (default is stdout)")
	CheckCmd.MarkFlagRequired("input")
}
