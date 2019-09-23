const baseNums = Array(9).fill(0).map((_, idx) => ++idx);

class Utils {
  static random(start, end) {
    return Math.floor(Math.random() * (end + 1 - start) + start);
  }

  static randomOne2Nine() {
    const nums = [...baseNums];
    Utils.randomArray(nums);
    return nums;
  }

  static randomArray(array) {
    const len = array.length - 1;
    Array(10).fill(0).forEach(() => {
      const start = Utils.random(0, len);
      const end = Utils.random(0, len);
      [array[start], array[end]] = [array[end], array[start]];
    });
  }
}

class Grid {
  constructor(rowIdx, colIdx, num) {
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.num = num;
    this.belongToPalace = this._belongToPalace(rowIdx, colIdx);
    this.availabelNums = [];
    this.availabelIdx = 0;
  }

  _belongToPalace(rowIdx, colIdx) {
    const palaceNum = Math.floor(rowIdx / 3) * 3 + Math.floor(colIdx / 3) + 1;
    return palaceNum;
  }

  next() {
    this.availabelIdx += 1
    return this.availabelNums[this.availabelIdx];
  }
}

class Board {
  constructor() {
    this.grids = this.generateGrids();
    this.fillFirstRow();
    this.fillRows();
    this.toArray();
  }

  generateGrids() {
    const grids = Array(9).fill(0).map((row, rowIdx) => (
      Array(9).fill(0).map((col, colIdx) => {
        const grid = new Grid(rowIdx, colIdx, null);
        return grid;
      })
    ));
    return grids;
  }

  fillFirstRow() {
    const randomNums = Utils.randomOne2Nine(); 
    this.grids[0].forEach(grid => {
      grid.num = randomNums.pop();
    });
  }

  fillRows(startRowIdx, startColIdx) {
    for(let i = 1; i < 9; i++) {
      if (i < startRowIdx) {
        continue;
      }
      for(let j = 0; j < 9; j++) {
        if (i === startRowIdx && j < startColIdx) {
          continue;
        }
        const grid = this.grids[i][j];
        const availabelNums = this.getAvailableNums(grid);
        if (availabelNums.length) {
          grid.availabelNums = availabelNums;
          grid.num = availabelNums[grid.availabelIdx];
        } else {
          const { rowIdx: a, colIdx: b } = this.toFlashBack(grid);
          return this.fillRows(a, b);
        }
      }
    }
  }

  toFlashBack(grid) {
    const { rowIdx, colIdx } = grid;
    if (colIdx !== 0) {
      // 列
      const prevGrid = this.grids[rowIdx][colIdx - 1];
      const isSucc = this.fillNextNum(prevGrid);
      if (!isSucc) {
        return this.toFlashBack(prevGrid)
      }
    } else {
      // 行
      this.grids[rowIdx - 1].forEach(grid => grid.num = null);

      const prevGrid = this.grids[rowIdx - 1][0];
      const isSucc = this.fillNextNum(prevGrid);
      if (!isSucc) {
        console.log('回溯上一行失败');
      }

      return {
        rowIdx: prevGrid.rowIdx,
        colIdx: prevGrid.colIdx,
      };
    }

    return {
      rowIdx,
      colIdx,
    };
  }

  fillNextNum(grid) {
    const nextNum = grid.next();
    grid.num = nextNum;
    if (!nextNum) {
      grid.availabelIdx = 0;
    }
    return !!nextNum;
  }

  getAvailableNums({ rowIdx: targetRowIdx, colIdx: targetColIdx, belongToPalace }) {
    const occupiedRowNums = [];
    const occupiedColNums = [];
    const occupiedPalaceNums = [];
    this.grids.forEach(row => {
      row.forEach(grid => {
        if (grid.num) {
          const { rowIdx, colIdx, palaceNum, num } = grid;
          if (rowIdx === targetRowIdx) {
            occupiedRowNums.push(num);
          }
          if (colIdx === targetColIdx) {
            occupiedColNums.push(num);
          }
          if (palaceNum === belongToPalace) {
            occupiedPalaceNums.push(num);
          }
        }
      })
    });

    const occupiedNums = new Set([...occupiedRowNums, ...occupiedColNums, ...occupiedPalaceNums]);
    const allNums = new Set(baseNums);
    const availabelNums = [...new Set([...allNums].filter(x => !occupiedNums.has(x)))];
    if (availabelNums.length) {
      Utils.randomArray(availabelNums);
    }
    return availabelNums;
  }

  toArray() {
    return this.grids.map(row => row.map(grid => {
      if (!grid.num) {
        console.log('failed');
        debugger
      }
      return grid.num;
    }))
  }
}

Array(100).fill(0).forEach(() => new Board())