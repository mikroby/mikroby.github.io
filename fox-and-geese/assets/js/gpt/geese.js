// Define a function to get all possible moves for a goose
function getGooseMoves(board, gooseRow, gooseCol) {
  var moves = [];

  // Check for possible moves in all eight directions
  if (
    gooseRow > 0 &&
    gooseCol > 0 &&
    board[gooseRow - 1][gooseCol - 1] === "◦"
  ) {
    moves.push([gooseRow - 1, gooseCol - 1]);
  }
  if (
    gooseRow > 0 &&
    gooseCol < board[0].length - 1 &&
    board[gooseRow - 1][gooseCol + 1] === "◦"
  ) {
    moves.push([gooseRow - 1, gooseCol + 1]);
  }

  return moves;
}

// Define a function to evaluate the current board state and return a score for the geese
function evaluateBoard(board) {
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

  // Check if the geese have lost
  if (numCaptured === 13) {
    return -Infinity;
  }

  // Calculate the geese's score based on the number of pieces on the board and the number of captured geese
  var score = numGeese - numCaptured;

  return score;
}

// Use the Minimax algorithm to find the best move for a goose
function minimax(board, depth, isMaximizingPlayer) {
  if (depth === 0) {
    return [evaluateBoard(board), null];
  }

  var bestMove = null;
  var bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  // Get all possible moves for each goose
  var gooseMoves = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === "⌂") {
        gooseMoves.push([i, j, getGooseMoves(board, i, j)]);
      }
    }
  }

  // Evaluate each possible move and choose the best one
  for (var i = 0; i < gooseMoves.length; i++) {
    var gooseRow = gooseMoves[i][0],
      gooseCol = gooseMoves[i][1];
    var moves = gooseMoves[i][2];

    for (var j = 0; j < moves.length; j++) {
      var move = moves[j];
      var newRow = move[0],
        newCol = move[1];

      // Make the move and evaluate the resulting board state
      board[newRow][newCol] = "⌂";
      board[gooseRow][gooseCol] = "◦";
      var score = minimax(board, depth - 1, !isMaximizingPlayer)[0];

      // Undo the move
      board[newRow][newCol] = "◦";
      board[gooseRow][gooseCol] = "⌂";

      // Choose the best move based on the current player's turn
      if (isMaximizingPlayer && score > bestScore) {
        bestScore = score;
        bestMove = [gooseRow, gooseCol, move];
      } else if (!isMaximizingPlayer && score < bestScore) {
        bestScore = score;
        bestMove = [gooseRow, gooseCol, move];
      }
    }
  }

  return [bestScore, bestMove];
}

export const step = (board) => {
  // Call the minimax function to find the best move for a goose and update the board
  const bestMove = minimax(board, 3, false)[1];
  // console.log(bestMove);
  if (bestMove) {
    board[bestMove[0]][bestMove[1]] = "◦";
    board[bestMove[2][0]][bestMove[2][1]] = "⌂";
    board[bestMove[2][0] + (bestMove[0] - bestMove[2][0]) / 2][
      bestMove[2][1] + (bestMove[1] - bestMove[2][1]) / 2
    ] = "C";
  }

  return board;
};
