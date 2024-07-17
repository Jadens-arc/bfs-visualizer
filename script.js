// const CellType = Object.freeze({
//   EMPTY: 0,
//   TRAVERSED: 1,
//   WALL: 2,
// });

// class Cell {
//   type;
//   constructor() {

//   }
// }

class Board {
  constructor(height, width) {
    this.grid = [];
    this.height = height;
    this.width = width;
    this.init_grid();
    this.board_container = document.getElementById("board");
    this.set_board_width();
  }


  init_grid() {
    this.grid = [];
    for (let i = 0; i < this.height; i++) {
      let row = []
      for (let j = 0; j < this.width; j++) {
        row.push(0);
      }
      this.grid.push(row);
    }
  }

  set_board_width() {
    let columns = ""
    for (let i = 0; i < this.width; i++) {
      columns += "auto ";
    }
    this.board_container.style.gridTemplateColumns = columns;
  }

  get_cell_html(cell, id) {
    let element = document.createElement("div");
    element.id = id;
    element.classList.add("cell");
    element.classList.add(cell ? "filled" : "empty");
    return element;
  }

  update_display() {
    this.board_container.innerHTML = "";
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        this.board_container.appendChild(this.get_cell_html(cell, `${i};${j}`));
      });
    });
  }

  mark(row, column, start=false) {
    this.grid[row][column] = 1;
    if (start) {
      document.getElementById(`${row};${column}`).classList.add('start');
    } else {
      document.getElementById(`${row};${column}`).classList.add('filled');
    }
  }

  set_start(row, column) {
    this.start = [row, column];
    this.mark(row, column, true);
  }

  set_end(row, column) {
    this.end = [row, column];
    this.mark(row, column);
  }

  get_cell_neighbors(row, column) {
    let neighbors = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) {
          continue;
        }
        if (row + i < 0 || row + i >= this.height) {
          continue
        }
        if (column + j < 0 || column + j >= this.height) {
          continue
        }
        if (this.grid[row + i][column + j]) {
          continue;
        }
        neighbors.push([row + i, column + j]);
      }
    }
    return neighbors;
  }

  traverse(q = this.get_cell_neighbors(this.start[0], this.start[1])) {
    if (!q.length) return;
    let cur = q.shift();
    if (this.grid[cur[0]][cur[1]]) {
      return this.traverse(q);
    }
    this.mark(cur[0], cur[1]);
    this.get_cell_neighbors(cur[0], cur[1]).forEach(cell => {
      if (!q.includes(cell)) {
        q.push(cell);
      }
    });
    setTimeout(() => {
      return this.traverse(q);
    }, 10);
  }

}

let b = new Board(25, 25);
b.update_display();

function template() {
  b.set_start(1, 10);
  for (let i = 0; i < 25; i++) {
    if (i == 20) {
      continue;
    }
    b.mark(i, 5);
  }
  for (let i = 0; i < 25; i++) {
    if (i == 1) {
      continue;
    }
    b.mark(i, 13);
  }
  for (let i = 0; i < 25; i++) {
    if (i == 24) {
      continue;
    }
    b.mark(i, 20);
  }
}

document.getElementById("traverse").onclick = (e) => {
  b.traverse();
};

document.getElementById("template").onclick = (e) => {
  template();
};

document.getElementById("reset").onclick = (e) => {
  b.init_grid();
  b.update_display();
};