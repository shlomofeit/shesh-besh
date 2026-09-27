const board = Array.from({ length: 24 }, () => ({ owner: null, checkers: 0 }));

board[23] = { owner: "white", checkers: 2 };
board[12] = { owner: "white", checkers: 5 };
board[7] = { owner: "white", checkers: 3 };
board[5] = { owner: "white", checkers: 5 };

board[0] = { owner: "black", checkers: 2 };
board[11] = { owner: "black", checkers: 5 };
board[16] = { owner: "black", checkers: 3 };
board[18] = { owner: "black", checkers: 5 };

export function initialGame() {
  const game = {
    board,
    currentPlayer: "white",
    dice: [],
    remainingDice: [],
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    status: "waiting-for-roll", // waiting-for-roll | waiting-for-move | finished
    winner: null,
  };

  return game;
}
