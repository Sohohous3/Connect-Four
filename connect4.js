class Game {
  constructor(width, heigth) {
    this.width = width;
    this.heigth = heigth;
    this.board = [];

    this.handleClick = this.handleClick.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.gameReset = this.gameReset.bind(this);
    this.startGame();
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
    this.player1 = new Player(this.player1Color);
    this.player2 = new Player(this.player2Color);
    this.currPlayer = this.player1;

  }

  makeBoard() {
    for (let y = 0; y < this.heigth; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  gameReset() {
    this.gameElement.innerHTML = "";
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.currPlayer = 1;
    this.gameOver = false;
  }

  startGame() {
    const startMenu = document.getElementById("start-menu");
    const gameArea = document.getElementById("game");
    const startButton = document.createElement("button");
    const player1Container = document.createElement("div");
    const player2Container = document.createElement("div");
    const color1Input = document.createElement("input");
    const color2Input = document.createElement("input");
    const label1 = document.createElement("label");
    const label2 = document.createElement("label");
    const submitButton1 = document.createElement("button");
    const submitButton2 = document.createElement("button");

    label1.textContent = "Player 1 Color : ";
    label1.setAttribute("for", "player1Color");
    label2.textContent = "Player 2 Color : ";
    label2.setAttribute("for", "player2Color");
    color1Input.setAttribute("type", "text");
    color2Input.setAttribute("type", "text");
    submitButton1.textContent = "Submit";
    submitButton2.textContent = "Submit";

    submitButton1.addEventListener("click", () => {
      this.player1.color = color1Input.value;
      color1Input.value = "";
    });

    submitButton2.addEventListener("click", () => {
      this.player2.color = color2Input.value;
      color2Input.value = "";
    });

    player1Container.appendChild(label1);
    player1Container.appendChild(color1Input);
    player1Container.appendChild(submitButton1);
    player2Container.appendChild(label2);
    player2Container.appendChild(color2Input);
    player2Container.appendChild(submitButton2);

    startButton.textContent = "Start Game";
    startButton.addEventListener("click", () => {
      startMenu.style.display = "none";
      gameArea.style.display = "block";
      this.gameReset();
      this.gameOver = false;
    });
    startMenu.appendChild(player1Container);
    startMenu.appendChild(player2Container);
    startMenu.appendChild(startButton);
    player1Container.classList.add("player1Container");
    player2Container.classList.add("player2Container");
  }

  makeHtmlBoard() {
    this.gameElement = document.getElementById('board');
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.resetButton = document.createElement("button");
    this.resetButton.textContent = "Reset Game"

    top.addEventListener('click', this.handleClick);
    this.resetButton.addEventListener("click", this.gameReset);
    this.gameElement.appendChild(this.resetButton);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    this.gameElement.append(top);
  
    for (let y = 0; y < this.heigth; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      this.gameElement.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.heigth - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`player-${this.currPlayer.color}`);
    piece.style.top = -50 * (y + 2);

    if (this.currPlayer === 1) {
      piece.style.backgroundColor = this.player1.color;
    } else if (this.currPlayer === 2){ 
      piece.style.backgroundColor = this.player2.color;
    }
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  handleClick(evt) {
    if (this.gameOver === false ) {
      const x = +evt.target.id;
      const y = this.findSpotForCol(x);

      if (y === null) {
        return;
      }
    
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);


      if (this.gameOver === false) {

      }
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer} won!`);
      }
      
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
      }
  }

  checkForWin() {
    const _win = (cells) => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.heigth &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };
    for (let y = 0; y < this.heigth; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player { 
  constructor(color) {
    this.color = color;
  }
}

new Game(4, 4);

