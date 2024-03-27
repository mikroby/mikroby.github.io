let foxRow, foxCol;

// Define a function to get all possible moves for the fox
function getFoxMoves(board, foxRow, foxCol) {
  var moves = [];

  // Check for possible moves in all eight directions
  if (foxRow > 0 && board[foxRow - 1][foxCol] === "◦") {
    moves.push([foxRow - 1, foxCol]);
  }
  if (foxRow < board.length - 1 && board[foxRow + 1][foxCol] === "◦") {
    moves.push([foxRow + 1, foxCol]);
  }
  if (foxCol > 0 && board[foxRow][foxCol - 1] === "◦") {
    moves.push([foxRow, foxCol - 1]);
  }
  if (foxCol < board[0].length - 1 && board[foxRow][foxCol + 1] === "◦") {
    moves.push([foxRow, foxCol + 1]);
  }
  if (foxRow > 0 && foxCol > 0 && board[foxRow - 1][foxCol - 1] === "◦") {
    moves.push([foxRow - 1, foxCol - 1]);
  }
  if (
    foxRow > 0 &&
    foxCol < board[0].length - 1 &&
    board[foxRow - 1][foxCol + 1] === "◦"
  ) {
    moves.push([foxRow - 1, foxCol + 1]);
  }
  if (
    foxRow < board.length - 1 &&
    foxCol > 0 &&
    board[foxRow + 1][foxCol - 1] === "◦"
  ) {
    moves.push([foxRow + 1, foxCol - 1]);
  }
  if (
    foxRow < board.length - 1 &&
    foxCol < board[0].length - 1 &&
    board[foxRow + 1][foxCol + 1] === "◦"
  ) {
    moves.push([foxRow + 1, foxCol + 1]);
  }

  return moves;
}

// Define a function to evaluate the current board state and return a score for the fox
function evaluateBoard(board) {
  var // foxRow,
    // foxCol,
    numGeese = 0,
    numCaptured = 0;

  // Find the fox position and count the number of geese
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === "▲") {
        foxRow = i;
        foxCol = j;
      } else if (board[i][j] === "⌂") {
        numGeese++;
      }
    }
  }

  // Check if the fox has won
  if (numGeese === numCaptured) {
    return Infinity;
  }

  // Check if the fox has lost
  if (foxRow === undefined || foxCol === undefined) {
    return -Infinity;
  }

  // Calculate the fox's score based on its position and the number of geese captured
  var score = getFoxMoves(board, foxRow, foxCol).length;
  score += numCaptured * 100;

  return score;
}

// Use the Minimax algorithm to find the best move for the fox
function minimax(board, depth, isMaximizingPlayer) {
  if (depth === 0) {
    return [evaluateBoard(board), null];
  }

  var bestMove = null;
  var bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  // Get all possible moves for the fox
  // var foxRow, foxCol;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === "▲") {
        foxRow = i;
        foxCol = j;
        break;
      }
    }
  }
  var foxMoves = getFoxMoves(board, foxRow, foxCol);

  // Evaluate each possible move and choose the best one
  for (var i = 0; i < foxMoves.length; i++) {
    var move = foxMoves[i];
    var newRow = move[0],
      newCol = move[1];

    // Make the move and evaluate the resulting board state
    board[newRow][newCol] = "▲";
    board[foxRow][foxCol] = "◦";
    var score = minimax(board, depth - 1, !isMaximizingPlayer)[0];

    // Undo the move
    board[newRow][newCol] = "◦";
    board[foxRow][foxCol] = "▲";

    // Choose the best move based on the current player's turn
    if (isMaximizingPlayer && score > bestScore) {
      bestScore = score;
      bestMove = move;
    } else if (!isMaximizingPlayer && score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return [bestScore, bestMove];
}

export const step = (board) => {
  // Call the minimax function to find the best move for the fox and update the board
  const bestMove = minimax(board, 3, true)[1];
  board[bestMove[0]][bestMove[1]] = "▲";
  board[foxRow][foxCol] = "◦";

  return board;
};
