const baseNums = Array(9).fill(0).map((_, idx) => ++idx);

class Utils {
  static random(start, end) {
    return Math.floor(Math.random() * (end + 1 - start) + start);
  }

  static randomOne2Nine() {
    const nums = [...baseNums];
    Array(10).fill(0).forEach(() => {
      const start = Utils.random(0, 8);
      const end = Utils.random(0, 8);
      [nums[start], nums[end]] = [nums[end], nums[start]];
    });
    return nums;
  }
}

class Palace {
  constructor(palaceNum) {
    this.palaceNum = palaceNum;
    this.palaceAvailableNums = [...baseNums];
    this.rowIdxStart = (Math.ceil(palaceNum / 3) - 1) * 3;
    this.rowIdxEnd = this.rowIdxStart + 3;
    this.colIdxStart = (Math.ceil(palaceNum / 3) - 1) * 3;
    this.colIdxEnd = this.colIdxStart + 3;
  }

  reduceNum(num) {
    this.palaceAvailableNums = this.palaceAvailableNums.filter(base => base !== num);
  }

  static calcBelongTo(rowIdx, colIdx) {
    const palaceNum = Math.floor(rowIdx / 3) * 3 + Math.floor(colIdx / 3) + 1;
    return palaceNum;
  }
}

class Grid {
  constructor(rowIdx, colIdx, num) {
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.num = num;
    this.belongToPalace = null;
  }
}

class Board {
  constructor() {
    this.palaces = this.generatePalace();
    this.grids = this.generateGrids();
    this.fillPalace(1, 5, 9);
    console.log(this.toArray());
  }

  generatePalace() {
    const palaces = baseNums.map(idx => new Palace(idx));
    return palaces;
  }

  generateGrids() {
    const grids = Array(9).fill(0).map((row, rowIdx) => (
      Array(9).fill(0).map((col, colIdx) => {
        const grid = new Grid(rowIdx, colIdx, null);
        grid.belongToPalace = this.palaces[Palace.calcBelongTo(rowIdx, colIdx) - 1];
        return grid;
      })
    ));
    return grids;
  }

  fillPalace(...palaceNums) {
    palaceNums.forEach(palaceNum => {
      const palace = this.palaces[palaceNum - 1];
      const { rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd } = palace;
      const randomNums = Utils.randomOne2Nine();
      for(let i = rowIdxStart; i < rowIdxEnd; i++) {
        for(let j = colIdxStart; j < colIdxEnd; j++) {
          this.grids[i][j].num = randomNums.pop();
        }
      }
    });
  }

  toArray() {
    return this.grids.map(row => {
      row = row.map(grid => grid.num);
      return row;
    })
  }
}
new Board();