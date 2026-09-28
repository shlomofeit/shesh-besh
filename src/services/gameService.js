export function rollDie() {
  const die = Math.floor(Math.random() * 6) + 1;
  return die;
}

export function transferTurn(currentPlayer) {
  const newPlayer = currentPlayer === "white" ? "black" : "white";
  const die1 = rollDie();
  const die2 = rollDie();
  const dice = [die1, die2];
  const remainingDice = die1 === die2 ? [die1, die1, die1, die1] : [die1, die2];

  const result = {
    currentPlayer: newPlayer,
    dice,
    remainingDice,
  };

  return result;
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
    remainingDice: [...playerDraw.firstPlayerDice],
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    status: "waiting-for-move", // waiting-for-roll | waiting-for-move | finished
    winner: null,
  };

  return game;
}

function pointToIndex(point, color) {
  return color === "white" ? point - 1 : 24 - point;
}

function calculateDestination(from, die, color) {
  return color === "white" ? from - die : from + die;
}

function getBarDestination(die, color) {
  return color === "white" ? 24 - die : die - 1;
}

function distanceToExit(index, color) {
  return color === "white" ? index + 1 : 24 - index;
}

export function isMoveLegal(color, die) {
  const otherPlayer = color === "white" ? "black" : "white";
  // const moveResult = otherPlayer === "white" ? 24 - die
}

export function applyMove(game, from, die) {
  const fromOwner = game.board[from].owner;

  if (fromOwner !== game.currentPlayer) {
    throw Object.assign(new Error("the owner is not leagal"), { status: 400 });
  }

  const destination = calculateDestination(from, die, game.currentPlayer);

  if (destination > 23 || destination < 0) {
    throw Object.assign(new Error("the move is not leagal"), { status: 400 });
  }

  if (
    game.board[destination].owner &&
    game.board[destination].owner !== game.currentPlayer
  ) {
    throw Object.assign(new Error("the move is not leagal"), { status: 400 });
  }

  const indexOfDice = game.remainingDice.indexOf(die);
  if (indexOfDice < 0) {
    throw Object.assign(new Error("the move is not leagal"), { status: 400 });
  }

  if (!game.board[destination].owner)
    game.board[destination].owner = game.currentPlayer;

  game.board[from].checkers -= 1;
  game.board[destination].checkers += 1;

  if (game.board[from].checkers === 0) game.board[from].owner = null;
  game.remainingDice.splice(indexOfDice, 1);

  if (game.remainingDice.length < 1) {
    const newTurn = transferTurn(game.currentPlayer);
    game.currentPlayer = newTurn.currentPlayer;
    game.dice = newTurn.dice;
    game.remainingDice = newTurn.remainingDice;
  }

  return game;
}
