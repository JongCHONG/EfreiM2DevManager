package greeter

import "testing"

func TestGreet_English(t *testing.T) {
	lang := Language("en")
	want := "Hello, World!"
	got, _ := Greet(lang)
	if got != want {
		t.Errorf("greet(%q) = %q; want %q", lang, got, want)
	}
}

func TestGreetV2(t *testing.T) {
	type testCase struct {
		lang     Language
		want     string
		wantErr  bool
		errValue string
	}
	var tests = map[string]testCase{
		"English": {
			lang: "en",
			want: "Hello, World!",
		},
		"French": {
			lang: "fr",
			want: "Bonjour, le monde!",
		},
		// "Empty": {
		// 	lang: "",
		// 	want: "Unknown language",
		// },
		// "Spanish, not supported": {
		// 	lang: "es",
		// 	want: "No greeting available for language: es",
		// },
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			got, err := Greet(test.lang)
			if err != nil {
				if !test.wantErr {
					t.Errorf("Unexpected error: %v", err)
				} else if err.Error() != test.errValue {
					t.Errorf("Expected error '%s', but got '%s'", test.errValue, err.Error())
				}
			} else if got != test.want {
				t.Errorf("Expected '%s', but got '%s'", test.want, got)
			}
		})
	}
}

func TestGreet(t *testing.T) {
	// Pour faire un bon test, il faut respecter 4 étapes :
	// 1. Definir les données d'entrée et le résultat attendu
	expectedGreeting := "Hello, World!"
	// 2. Appeler la fonction à tester
	greeting, _ := Greet("en")
	// 3. Vérifier le résultat
	if greeting != expectedGreeting {
		t.Errorf("Expected '%s', but got '%s'", expectedGreeting, greeting)
	}
	// 4. Nettoyer les ressources si nécessaire
}
