import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber);
    const currentSquare = calculateCurrentSquare(history, this.state.stepNumber);
    if (calculateWinner(currentSquare) || currentSquare[i]) {
      return;
    }
    const colrow = getColRowFromIndex(i);
    const newHistory = history.concat([colrow]);
    this.setState({
      history: newHistory,
      stepNumber: newHistory.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    })
  }

  render() {
    const history = this.state.history.slice();
    const currentSquare = calculateCurrentSquare(history, this.state.stepNumber);
    const winner = calculateWinner(currentSquare);

    const moves = history.map((colrow, idx) => {
      const desc = 'Go to move #' + (idx + 1) +': (' + colrow[1] + ', ' + colrow[0] + ')';
      return (
        <li key={idx+1}>
          <button onClick={() => this.jumpTo(idx + 1)} className={this.state.stepNumber -1 === idx ? 'active' : ''}>{desc}</button>
        </li>
      )
    });
    moves.unshift(
      <li key={0}>
        <button onClick={() => this.jumpTo(0)}>Go to game start</button>
      </li>
    )

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + getSymbolByStepNumber(this.state.stepNumber);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquare}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateCurrentSquare(history, targetStepNumber) {
  let square = Array(9).fill(null);
  return history.slice(0, targetStepNumber).map((colrow, stepNumber) => [colrow, stepNumber]).reduce((acc, elem) => {
    let s = acc.slice();
    let [colrow, stepNumber] = elem;
    let idx = getIndexFromColRow(...colrow);
    let symbol = getSymbolByStepNumber(stepNumber);
    s[idx] = symbol;
    return s;
  }, square);
}

const colrow = [[0,1,2],[3,4,5],[6,7,8]];
function getIndexFromColRow(col, row) {
  return colrow[row][col];
}
function getColRowFromIndex(index) {
  const flatten = colrow.flatMap((row, rowIdx) => row.map((_, colIdx) => [colIdx, rowIdx]));
  return flatten[index];
}

function getSymbolByStepNumber(stepNumber) {
  return stepNumber % 2 == 0 ? 'O' : 'X';
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  