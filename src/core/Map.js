// src/core/Map.js

// 第 1 关地图：20x20
// 只有上下左右四条边是墙壁（值为 1），内部 18x18 全部是空地（0）
// 适合第 1 关作为简单入门关卡

export const LEVEL_1_MAP = [];

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

for (let y = 0; y < GRID_HEIGHT; y++) {
  const row = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    if (
      y === 0 ||               // 上边界
      y === GRID_HEIGHT - 1 || // 下边界
      x === 0 ||               // 左边界
      x === GRID_WIDTH - 1     // 右边界
    ) {
      row.push(1); // 墙壁
    } else {
      row.push(0); // 空地
    }
  }
  LEVEL_1_MAP.push(row);
}