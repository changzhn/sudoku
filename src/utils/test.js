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
    this.rowIdxStart = (Math.ceil(palaceNum / 3) - 1) * 3;
    this.rowIdxEnd = this.rowIdxStart + 3;

    let colRest = palaceNum % 3;
    if (colRest === 0) {
      colRest = 3;
    }
    this.colIdxStart = (colRest - 1) * 3;
    this.colIdxEnd = this.colIdxStart + 3;
  }

  // reduceNum(num) {
  //   this.palaceAvailableNums = this.palaceAvailableNums.filter(base => base !== num);
  // }

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
    this.fillPalaceRandom(1, 5, 9);
    this.fillPalaceStep(2, 3, 4, 6, 7, 8);

    // FIXME:
    let array = this.toArray();
    return array;
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

  fillPalaceRandom(...palaceNums) {
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

  fillPalaceStep(...palaceNums) {
    palaceNums.forEach(palaceNum => {
      const palace = this.palaces[palaceNum - 1];
      const { rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd } = palace;
      for(let i = rowIdxStart; i < rowIdxEnd; i++) {
        for(let j = colIdxStart; j < colIdxEnd; j++) {
          const grid = this.grids[i][j];
          const availabelNums = this.getAvailableNums(grid);
          if (availabelNums.length) {
            grid.num = availabelNums[0];
          }
        }
      }
    });
  }

  getAvailableNums({ rowIdx: targetRowIdx, colIdx: targetColIdx, belongToPalace }) {
    const { palaceNum: targetPalaceNum } = belongToPalace;
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
          if (palaceNum === targetPalaceNum) {
            occupiedPalaceNums.push(num);
          }
        }
      })
    });

    const occupiedNums = new Set([...occupiedRowNums, ...occupiedColNums, ...occupiedPalaceNums]);
    const allNums = new Set(baseNums);
    const availabelNums = [...new Set([...allNums].filter(x => !occupiedNums.has(x)))];
    return availabelNums;
  }

  toArray() {
    return this.grids.map(row => row.map(grid => grid.num))
  }
}

console.log(new Board())