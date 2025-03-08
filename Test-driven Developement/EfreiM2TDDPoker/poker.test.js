const {
  compareHands,
  playGame,
  rankHand,
  isValidHand,
  askForHand,
} = require("./poker");
const readline = require("readline");
const {} = require("./poker");
jest.mock("readline");

describe("compareHands", () => {
  test("compareHands should return 1 when right hand is stronger", () => {
    expect(compareHands(["fullHouse"], ["pair"])).toBe(1);
  });

  test("compareHands should return -1 when left hand is stronger", () => {
    expect(compareHands(["pair"], ["fullHouse"])).toBe(-1);
  });

  test("compareHands should return 0 when both hands are equal", () => {
    expect(compareHands(["pair"], ["pair"])).toBe(0);
  });

  test("compareHands should return 1 when right hand is royalFlush and left hand is straightFlush", () => {
    expect(compareHands(["royalFlush"], ["straightFlush"])).toBe(1);
  });

  test("compareHands should return -1 when left hand is fourOfAKind and right hand is fullHouse", () => {
    expect(compareHands(["fullHouse"], ["fourOfAKind"])).toBe(-1);
  });

  test("compareHands should return 0 when both hands are highCard", () => {
    expect(compareHands(["highCard"], ["highCard"])).toBe(0);
  });
});

describe("rankHand", () => {
  test("should return 100 for royalFlush", () => {
    expect(rankHand(["royalFlush"])).toBe(100);
  });

  test("should return 75 for straightFlush", () => {
    expect(rankHand(["straightFlush"])).toBe(75);
  });

  test("should return 25 for fullHouse", () => {
    expect(rankHand(["fullHouse"])).toBe(25);
  });

  test("should return 2 for pair", () => {
    expect(rankHand(["pair"])).toBe(2);
  });

  test("should return 1 for highCard", () => {
    expect(rankHand(["highCard"])).toBe(1);
  });

  test("should return 0 for an empty hand", () => {
    expect(rankHand([])).toBe(0);
  });

  test("should return 0 for an invalid hand", () => {
    expect(rankHand(["notAHand"])).toBe(0);
  });

  test("should return the highest rank if multiple ranks are present", () => {
    expect(rankHand(["pair", "royalFlush"])).toBe(100); // royalFlush est plus fort
  });
});

describe("isValidHand", () => {
  test("should return true for a valid hand", () => {
    expect(isValidHand(["royalFlush"])).toBe(true);
  });

  test("should return true for multiple valid hands", () => {
    expect(isValidHand(["pair", "straight", "flush"])).toBe(true);
  });

  test("should return false for an invalid hand", () => {
    expect(isValidHand(["invalidHand"])).toBe(false);
  });

  test("should return false for a mix of valid and invalid hands", () => {
    expect(isValidHand(["fullHouse", "invalidHand"])).toBe(false);
  });

  test("should return true for an empty hand", () => {
    expect(isValidHand([])).toBe(true);
  });
});

describe("askForHand", () => {
  let rl;
  let askForHand;
  let isValidHand;
  // je comprend pas comment ça marche le mocked
  
  beforeEach(() => {
    rl = {
      question: jest.fn(),
    };
    readline.createInterface.mockReturnValue(rl);

    isValidHand = jest.fn();
    jest.doMock("./poker", () => ({
      ...jest.requireActual("./poker"),
      isValidHand,
    }));

    askForHand = require("./poker").askForHand;
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should prompt the user and call callback with a valid hand", () => {
    const callback = jest.fn();

    isValidHand.mockReturnValue(true);

    askForHand("Enter your hand: ", callback);
    expect(rl.question).toHaveBeenCalledWith(
      "Enter your hand: ",
      expect.any(Function)
    );

    const userInput = "pair, fullHouse";
    const questionCallback = rl.question.mock.calls[0][1];
    questionCallback(userInput);

    expect(callback).toHaveBeenCalledWith(["pair", "fullHouse"]);
  });
});
