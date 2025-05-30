package reporter

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/JongCHONG/tp_gowatcher/internal/checker"
)

func ExportResultsToJsonFile(filePath string, results []checker.ReportEntry) error {
	data, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal results to JSON: %w", err)
	}

	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return fmt.Errorf("failed to write file %s: %w", filePath, err)
	}

	return nil
}
