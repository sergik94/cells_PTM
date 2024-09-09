class Field {
  _data = [
    [1, 1, 2, 3, 2, 2],
    [1, 1, 2, 3, 3, 3],
    [1, 2, 2, 3, 3, 3],
    [1, 2, 2, 2, 2, 3],
    [4, 2, 2, 2, 4, 4],
    [4, 4, 2, 2, 3, 2],
    [4, 4, 4, 1, 1, 2]
  ];

  targetCell = null;

  constructor(parentElement) {
    this.parentElement = parentElement;
  }

  get data() {
    return this._data;
  }

  get totalRows() {
    return this._data.length;
  }

  get totalColumns() {
    return this._data[0].length;
  }

  create() {
    for (let i = 0; i < this.totalRows; i++) {
      const rowData = this._data[i];
      const tr = document.createElement('tr');
    
      for (let j = 0; j < this.totalColumns; j++) {
        const cellData = rowData[j];
        const td = document.createElement('td');
        td.dataset.position = `${i},${j}`;
    
        td.append(cellData);
        tr.append(td);
      }
    
      tableBody.append(tr);
    }
  }

  handleEvent(e) {
    switch (e.type) {
      case 'click': {
        this.targetCell = e.target;
      }
    } 
  }
}

class Cells extends Field {
  cellValue = null;
  resultSet = new Set();

  resetResults() {
    const cells = document.querySelectorAll('td');

    cells.forEach(cell => {
      cell.classList.remove('active');
    });

    this.resultSet.clear();
  }

  getLinearlyMergedCells(position) {
    const [i, j] = position.split(',').map(p => +p);
  
    let isLeftBlock = false;
    let isRightBlock = false;
    let isTopBlock = false;
    let isBottBlock = false;

    let k = 1;

    while (
      j + k < this.totalRows || j - k >= 0 ||
      i + k < this.totalColumns || i - k >= 0
    ) {
      if (j + k <= this.totalRows && !isRightBlock) {
        if (super.data[i][j + k] === this.cellValue) {
          this.resultSet.add(`${i},${j + k}`)
        } else {
          isRightBlock = true;
        }
      }

      if (j - k >= 0  && !isLeftBlock) {
        if (super.data[i][j - k] === this.cellValue) {
          this.resultSet.add(`${i},${j - k}`)
        } else {
          isLeftBlock = true;
        }
      }

      if (i + k <= this.totalColumns && !isBottBlock) {
        if (super.data[i + k][j] === this.cellValue) {
          this.resultSet.add(`${i + k},${j}`)
        } else {
          isBottBlock = true;
        }
      }

      if (i - k >= 0 && !isTopBlock) {
        if (super.data[i - k][j] === this.cellValue) {
          this.resultSet.add(`${i - k},${j}`)
        } else {
          isTopBlock = true;
        }
      }

      k++;
    }
  }

  getAllMergedCells() {
    for (let point of this.resultSet) {
      this.getLinearlyMergedCells(point);
    }
  }

  markActiveCells() {
    this.resultSet.forEach(position => {
      const cell = document.querySelector(`[data-position="${position}"]`);
  
      cell.classList.add('active');
    });
  }

  handleEvent(e) {
    super.handleEvent(e);
    this.resetResults();

    this.cellValue = +this.targetCell.innerText;
    this.resultSet.add(this.targetCell.dataset.position);

    this.getAllMergedCells();
    this.markActiveCells();
  }
}

const tableBody = document.querySelector('tbody');
const cells = new Cells(tableBody);

cells.create();
tableBody.addEventListener('click', cells);
