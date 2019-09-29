# sudoku game

> 何为数独 [百度百科](https://baike.baidu.com/item/%E6%95%B0%E7%8B%AC/74847)

在线试玩地址 https://changzhn.github.io/sudoku/

游戏截图
<img src="./README.assets/Snipaste_01.png" />

完成的功能：
- 棋盘展示
- 游戏基本流程
- 开始游戏算法
- 终局游戏提示
- 历史步骤

待完成的功能：
- 游戏时间显示
- 暂停游戏(遮盖棋盘)

## 如何启动
```shell
git colone https://github.com/changzhn/sudoku.git
cd sudoku
npm install
# or yarn
npm start

# build
npm run build
```

## 如何生成终局棋盘数字
- 使用终局数字进行行列交换；
- 使用随机填充，填充方法；
  1. 随机填充第一行；
  2. 开始填充第二行，需要每列单独填充。找出可用数字（行、列、宫不能重复），随机选择一个数字填充，填充完毕再进行下一列；
  3. 重复第2步进行下一行，直至填充完，这样生成的终局棋盘可能（几乎百分之百）中间有`null`值（没有可用数字时填`null`）；
  4. 在某方格无可用数字时，去重新计算其上一列的填充数字，方法就是在上一列的可用数字中再选取一个可能数字（回溯）；
  5. 如上一列无可用数字时，重复第4步；
  6. 如果回溯到该行的第一列时，需要回溯上一行，清空上一行填入数字，从第一列开始填充，填充数字在可用数字中再选取一个；
  7. 重复第2步；
  8. 利用列回溯和行回溯，即可生成终局棋盘；
  9. 代码在这里 https://github.com/changzhn/sudoku/blob/master/src/utils/SudokuCls.ts#L91

- 另一种填充方法
  1. 随机数字填充第1、5、9宫；
  2. 然后使用上面的方法填充剩下的方格；
  3. 代码在 https://github.com/changzhn/sudoku/blob/master/src/utils/SudokuCls.palace.ts 有bug;

## 参考文章
[用 JS 做一个数独游戏（一）](https://www.cnblogs.com/brifuture/p/9322409.html)