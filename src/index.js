import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={"square" + (props.isEmphasis ? " win" : "")} onClick={props.onClick}>
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
        isEmphasis={this.props.winSquares != null && this.props.winSquares.includes(i)}
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

class History extends React.Component {

  render() {
    const history = this.props.history.slice();
    if (!this.props.isAsc) history.reverse();
    const moves = history.map((colrow, idx) => {
      const stepNumber = this.props.isAsc ? idx+1 : history.length - idx;
      const desc = 'Go to move #' + stepNumber +': (' + colrow[1] + ', ' + colrow[0] + ')';
      return (
        <li key={stepNumber}>
          <button onClick={() => this.props.jumpTo(stepNumber)} className={this.props.stepNumber === stepNumber ? 'active' : ''}>{desc}</button>
        </li>
      )
    });
    if (this.props.isAsc) {
      moves.unshift(
        <li key={0}>
          <button onClick={() => this.props.jumpTo(0)}>Go to game start</button>
        </li>
      )
    } else {
      moves.push(
        <li key={0}>
          <button onClick={() => this.props.jumpTo(0)}>Go to game start</button>
        </li>
      )
    }
    return (
      <ol>{moves}</ol>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      stepNumber: 0,
      isAsc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber);
    const currentSquare = calculateCurrentSquare(history, this.state.stepNumber);
    if (calculateWinningSquares(currentSquare) || currentSquare[i]) {
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

  toggle(isAsc) {
    this.setState({
      isAsc: !isAsc
    })
  }

  render() {
    const history = this.state.history.slice();
    const currentSquare = calculateCurrentSquare(history, this.state.stepNumber);
    const winningSquares = calculateWinningSquares(currentSquare);

    let status;
    if (winningSquares != null) {
      status = 'Winner: ' + currentSquare[winningSquares[0]];
    } else {
      status = 'Next player: ' + getSymbolByStepNumber(this.state.stepNumber);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquare}
            onClick={(i) => this.handleClick(i)}
            winSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggle(this.state.isAsc)}>toggle</button>
          <History
            history={this.state.history}
            isAsc={this.state.isAsc}
            stepNumber={this.state.stepNumber}
            jumpTo={(step) => this.jumpTo(step)}/>
        </div>
      </div>
    );
  }
}

function calculateWinningSquares(squares) {
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
      return [a, b, c];
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
  