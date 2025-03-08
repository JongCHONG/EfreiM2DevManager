const readline = require('readline');

const chiffres = {
  1: 'I',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  50: 'L',
  100: 'C',
  500: 'D',
  1000: 'M'
}

function convertToRoman (number) {
  const numberString = number.toString()
  const numberArray = numberString.split('')
  const numberArrayLength = numberArray.length
  let result = ''
  let i = 0
  let j = numberArrayLength - 1

  while (i < numberArrayLength) {
    const chiffre = parseInt(numberArray[i])
    const puissance = Math.pow(10, j)
    const value = chiffre * puissance

    if (chiffres[value]) {
      result += chiffres[value]
    } else {
      if (chiffre < 4) {
        result += chiffres[puissance].repeat(chiffre)
      } else if (chiffre === 4) {
        result += chiffres[puissance * 1] + chiffres[puissance * 5]
      } else if (chiffre === 5) {
        result += chiffres[puissance * 5]
      } else if (chiffre < 9) {
        result += chiffres[puissance * 5] + chiffres[puissance].repeat(chiffre - 5)
      } else {
        result += chiffres[puissance * 1] + chiffres[puissance * 10]
      }
    }

    i++
    j--
  }

  return result
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion() {
  rl.question('Veuillez fournir un nombre valide en argument (ou tapez ":q" pour quitter) : ', (input) => {
    if (input.toLowerCase() === ':q') {
      rl.close();
    } else {
      const number = parseInt(input);

      if (!isNaN(number)) {
        console.log(convertToRoman(number));
      } else {
        console.log('Veuillez fournir un nombre valide en argument.');
      }

      askQuestion();
    }
  });
}

askQuestion();