package checker

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/JongCHONG/tp_gowatcher/internal/config"
)

type ReportEntry struct {
	Name   string
	URL    string
	Owner  string
	Status string
	ErrMsg string
}

type CheckResult struct {
	InputTarget config.InputTarget
	Status      string
	Err         error
}

// type CheckResult struct {
// 	Target string
// 	Status string
// 	Err    error
// }

func CheckURL(target config.InputTarget) CheckResult {
	client := http.Client{
		Timeout: 3 * time.Second,
	}

	// Make the HTTP GET request
	resp, err := client.Get(target.URL)
	// If there was an error making the request, we send an error result
	if err != nil {
		return CheckResult{
			InputTarget: target,
			Status:      "",
			Err: &UnreachableURLError{
				URL: target.URL,
				Err: err,
			},
		}
	}

	// defer is used to ensure that the response body is closed after we're done with it
	defer resp.Body.Close()

	// If the request was successful, we can send the result
	return CheckResult{
		InputTarget: target,
		Status:      resp.Status,
		Err:         nil,
	}
}

// ConvertToReportEntry converts result to a new struct ReportEntry
func ConvertToReportEntry(result CheckResult) ReportEntry {
	report := ReportEntry{
		Name:   result.InputTarget.Name,
		URL:    result.InputTarget.URL,
		Owner:  result.InputTarget.Owner,
		Status: result.Status,
	}

	if result.Err != nil {
		var unreachableURLError *UnreachableURLError
		if errors.As(result.Err, &unreachableURLError) {
			report.Status = "Inaccessible"
			report.ErrMsg = fmt.Sprintf("Error accessing URL %s: %v", unreachableURLError.URL, unreachableURLError.Err)
		} else {
			report.Status = "Error"
			report.ErrMsg = fmt.Sprintf("Error: %v", result.Err)
		}
	}

	return report
}

// For waitGroup example, we can use the following function signature
// func CheckURL(url string) CheckResult {
// 	client := http.Client{
// 		Timeout: 3 * time.Second,
// 	}

// 	// Make the HTTP GET request
// 	resp, err := client.Get(url)
// 	// If there was an error making the request, we send an error result
// 	if err != nil {
// 		return CheckResult{Target: url, Err: &UnreachableURLError{
// 			URL: url,
// 			Err: err}}
// 	}

// 	// defer is used to ensure that the response body is closed after we're done with it
// 	defer resp.Body.Close()

// 	// If the request was successful, we can send the result
// 	return CheckResult{
// 		Target: url,
// 		Status: resp.Status,
// 	}
// }

// CheckURL checks the given URL by making an HTTP GET request.
// url: the URL to check
// results: a channel to send the result of the check
// func CheckURL(url string, results chan<- CheckResult) {
// 	client := http.Client{
// 		Timeout: 3 * time.Second,
// 	}

// 	// Make the HTTP GET request
// 	resp, err := client.Get(url)
// 	// If there was an error making the request, we send an error result
// 	if err != nil {
// 		results <- CheckResult{Target: url, Err: fmt.Errorf("request failed: %w", err)}
// 		return
// 	}

// 	// defer is used to ensure that the response body is closed after we're done with it
// 	defer resp.Body.Close()

// 	// If the request was successful, we can send the result
// 	results <- CheckResult{
// 		Target: url,
// 		Status: resp.Status,
// 	}
// }
