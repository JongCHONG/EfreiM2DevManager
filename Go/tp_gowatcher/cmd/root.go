package cmd

// Pour pouvoir utiliser cobra, il faut l'installer
// go get -u github.com/spf13/cobra@latest

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "gowatcher",
	Short: "A simple tool to check the availability of URLs",
	Long:  "gowatcher is a simple command-line tool that checks the availability of a list of URLs.",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

// init function is called automatically when the package is imported
func init() {
	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
