export function rollDie() {
  const die = Math.floor(Math.random() * 6) + 1;
  return die;
}

export function firstPlayerDraw() {
  let black = rollDie();
  let white = rollDie();

  while (black === white) {
    black = rollDie();
    white = rollDie();
  }

  const result = black > white ? "black" : "white";
  const firstPlayerDice = [black, white];

  return { result, firstPlayerDice };
}

export function initialGame() {
  const board = Array.from({ length: 24 }, () => ({
    owner: null,
    checkers: 0,
  }));

  board[23] = { owner: "white", checkers: 2 };
  board[12] = { owner: "white", checkers: 5 };
  board[7] = { owner: "white", checkers: 3 };
  board[5] = { owner: "white", checkers: 5 };

  board[0] = { owner: "black", checkers: 2 };
  board[11] = { owner: "black", checkers: 5 };
  board[16] = { owner: "black", checkers: 3 };
  board[18] = { owner: "black", checkers: 5 };

  const playerDraw = firstPlayerDraw();
  const game = {
    board,
    currentPlayer: playerDraw.result,
    dice: playerDraw.firstPlayerDice,
    remainingDice: playerDraw.firstPlayerDice,
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    status: "waiting-for-move", // waiting-for-roll | waiting-for-move | finished
    winner: null,
  };

  return game;
}
