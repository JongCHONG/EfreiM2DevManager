const readline = require("readline");

const poker = {
  royalFlush: 100,
  straightFlush: 75,
  fourOfAKind: 50,
  fullHouse: 25,
  flush: 20,
  straight: 15,
  threeOfAKind: 10,
  twoPair: 5,
  pair: 2,
  highCard: 1,
};

const handRanks = Object.keys(poker);

const rankHand = (hand) => {
  for (let rank of handRanks) {
    if (hand.includes(rank)) {
      return poker[rank];
    }
  }
  return 0;
};

function compareHands(right, left) {
  const rightHand = rankHand(right);
  const leftHand = rankHand(left);

  if (rightHand > leftHand) {
    console.log(`Right: ${rightHand} > Left: ${leftHand}`);
    console.log("Right wins!");
    return 1;
  } else if (rightHand < leftHand) {
    console.log(`Left: ${leftHand} > Right: ${rightHand}`);
    console.log("Left wins!");
    return -1;
  } else {
    console.log(`It's a tie with ${rightHand} points each!`);
    return 0;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const validHands = Object.keys(poker);

const isValidHand = (hand) => {
  return hand.every((card) => validHands.includes(card));
};

const askForHand = (prompt, callback) => {
  rl?.question(prompt, (input) => {
    const hand = input.split(",").map((card) => card.trim());
    if (isValidHand(hand)) {
      callback(hand);
    } else {
      console.log("Invalid hand, please try again.");
      askForHand(prompt, callback);
    }
  });
};

const playGame = () => {
  askForHand("Enter the right hand (comma separated): ", (rightHand) => {
    askForHand("Enter the left hand (comma separated): ", (leftHand) => {
      compareHands(rightHand, leftHand);
      rl.question("Do you want to play again? (yes/no): ", (answer) => {
        if (answer.toLowerCase() === "yes") {
          playGame();
        } else {
          rl.close();
        }
      });
    });
  });
};

playGame();

module.exports = {
  compareHands,
  playGame,
  rankHand,
  isValidHand,
  askForHand,
};
