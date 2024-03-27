// Define the board as a 2D array
var board = [
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["◦", "◦", "◦", "◦", "◦"],
  ["◦", "◦", "▲", "◦", "◦"],
];

const displayBoard = (board) => {
  for (const row of board) {
    console.log(row.join(" "));
  }
};

// Define a function to get all possible moves for a piece
function getMoves(board, row, col) {
  var moves = [];

  // Check for possible moves in all eight directions
  if (row > 0 && board[row - 1][col] === "◦") {
    moves.push([row - 1, col]);
  }
  if (row < board.length - 1 && board[row + 1][col] === "◦") {
    moves.push([row + 1, col]);
  }
  if (col > 0 && board[row][col - 1] === "◦") {
    moves.push([row, col - 1]);
  }
  if (col < board[0].length - 1 && board[row][col + 1] === "◦") {
    moves.push([row, col + 1]);
  }
  if (row > 0 && col > 0 && board[row - 1][col - 1] === "◦") {
    moves.push([row - 1, col - 1]);
  }
  if (row > 0 && col < board[0].length - 1 && board[row - 1][col + 1] === "◦") {
    moves.push([row - 1, col + 1]);
  }
  if (row < board.length - 1 && col > 0 && board[row + 1][col - 1] === "◦") {
    moves.push([row + 1, col - 1]);
  }
  if (
    row < board.length - 1 &&
    col < board[0].length - 1 &&
    board[row + 1][col + 1] === "◦"
  ) {
    moves.push([row + 1, col + 1]);
  }

  return moves;
}

// Define a function to evaluate the current board state and return a score for the given player
function evaluateBoard(board, player) {
  var numGeese = 0,
    numCaptured = 0;

  // Count the number of geese and captured geese
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === "⌂") {
        numGeese++;
      } else if (board[i][j] === "C") {
        numCaptured++;
      }
    }
  }

  // Check if the geese have won
  if (numGeese <= 5) {
    return Infinity;
  }

  // Check if the fox has won
  if (numCaptured === 13) {
    return -Infinity;
  }

  // Calculate the player's score based on the number of pieces on the board and the number of captured geese
  var score =
    player === "▲"
      ? getMoves(board, foxRow, foxCol).length
      : numGeese - numCaptured;

  return score;
}

// Use the Minimax algorithm to find the best move for a player
function minimax(board, depth, isMaximizingPlayer) {
  if (depth === 0) {
    return [evaluateBoard(board, isMaximizingPlayer ? "▲" : "⌂"), null];
  }

  var bestMove = null;
  var bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  // Get all possible moves for each piece
  var moves = [];
  if (isMaximizingPlayer) {
    // Fox's turn
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] === "▲") {
          moves.push([i, j, getMoves(board, i, j)]);
        }
      }
    }
  } else {
    // Geese's turn
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] === "⌂") {
          moves.push([i, j, getMoves(board, i, j)]);
        }
      }
    }
  }

  // Evaluate each possible move and choose the best one
  for (var i = 0; i < moves.length; i++) {
    var row = moves[i][0],
      col = moves[i][1];
    var subMoves = moves[i][2];

    for (var j = 0; j < subMoves.length; j++) {
      var move = subMoves[j];
      var newRow = move[0],
        newCol = move[1];

      // Make the move and evaluate the resulting board state
      var oldPiece = board[newRow][newCol];
      board[newRow][newCol] = isMaximizingPlayer ? "▲" : "⌂";
      board[row][col] = "◦";
      if (oldPiece === "⌂") {
        board[newRow + (row - newRow) / 2][newCol + (col - newCol) / 2] = "C";
      }
      var score = minimax(board, depth - 1, !isMaximizingPlayer)[0];

      // Undo the move
      board[newRow][newCol] = "◦";
      board[row][col] = isMaximizingPlayer ? "▲" : "⌂";
      if (oldPiece === "⌂") {
        board[newRow + (row - newRow) / 2][newCol + (col - newCol) / 2] = "⌂";
      }

      // Choose the best move based on the current player's turn
      if (isMaximizingPlayer && score > bestScore) {
        bestScore = score;
        bestMove = [row, col, move];
      } else if (!isMaximizingPlayer && score < bestScore) {
        bestScore = score;
        bestMove = [row, col, move];
      }
    }
  }

  return [bestScore, bestMove];
}

// Call the minimax function to find the best move for each player and update the board
var foxRow, foxCol;
for (var i = 0; i < board.length; i++) {
  for (var j = 0; j < board[i].length; j++) {
    if (board[i][j] === "▲") {
      foxRow = i;
      foxCol = j;
      break;
    }
  }
}
var isFoxTurn = true;
while (true) {
  var bestMove = minimax(board, 3, isFoxTurn)[1];
  if (!bestMove) {
    console.log(isFoxTurn ? "Geese win!" : "Fox wins!");
    break;
  }
  board[bestMove[0]][bestMove[1]] = "◦";
  board[bestMove[2][0]][bestMove[2][1]] = isFoxTurn ? "▲" : "⌂";
  if (bestMove[2][2]) {
    board[bestMove[2][0] + (bestMove[0] - bestMove[2][0]) / 2][
      bestMove[2][1] + (bestMove[1] - bestMove[2][1]) / 2
    ] = "C";
  }

  console.log("-------------------");
  displayBoard(board);

  // Switch turns
  isFoxTurn = !isFoxTurn;

  // Check for end of game
  if (isFoxTurn) {
    var foxMoves = getMoves(board, foxRow, foxCol);
    if (foxMoves.length === 0) {
      console.log("Geese win!");
      break;
    }
  } else {
    var numGeese = 0,
      numCaptured = 0;
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] === "⌂") {
          numGeese++;
        } else if (board[i][j] === "C") {
          numCaptured++;
        }
      }
    }
    if (numGeese <= 5 || numCaptured === 13) {
      console.log("Fox wins!");
      break;
    }
  }
}
