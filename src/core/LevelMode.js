import { Snake, DIRECTIONS } from './Snake.js';
import { Food } from './Food.js';
import { LEVEL_1_MAP } from './Map.js';


export class LevelMode {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.gridWidth = 20;
    this.gridHeight = 20;
    this.tileSize = 20;

    this.currentLevel = 1;
    this.targetFoodCount = 3; // 第1关：吃3个食物
    this.foodEaten = 0;

    this.map = LEVEL_1_MAP; // 第1关地图

    this.snake = new Snake(this.gridWidth, this.gridHeight, 3, 3, this.map);
    this.food = null;

    this.running = true;

    this.moveInterval = 200; // 每 200ms 移动一次，约每秒 5 次，可调整
    this.lastMoveTime = 0;   // 上一次移动的时间戳

    this.setupFood(); // 初始化食物
    this.setupInput();
  }

  setupFood() {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * this.gridWidth);
      const y = Math.floor(Math.random() * this.gridHeight);
      if (
        this.map[y][x] === 0 && // 空地
        !this.snake.isOccupying(x, y) // 不与蛇身重叠（需 Snake.js 支持）
      ) {
        this.food = new Food(this.gridWidth, this.gridHeight, x, y);
        placed = true;
      }
    }
  }

  setupInput() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
     * 键盘事件处理
     * @param {KeyboardEvent} e 
     */
  handleKeyDown(e) {
    const key = e.key;

    if (key === 'r' || key === 'R') {
      // R 键：**仅在游戏结束时可重启**
      if (!this.running && this.snake && !this.snake.isAlive()) {
        this.reset(); // 重置游戏，继续玩
      }
      // 游戏进行中按 R 不做任何事
      return;
    }

    // 以下为正常游戏中的方向键控制（仅在游戏运行中生效）
    if (!this.running || !this.snake.isAlive()) {
      return;
    }

    const keyDirections = {
      'ArrowUp': DIRECTIONS.UP,
      'ArrowDown': DIRECTIONS.DOWN,
      'ArrowLeft': DIRECTIONS.LEFT,
      'ArrowRight': DIRECTIONS.RIGHT,
    };

    const direction = keyDirections[key];
    if (direction) {
      this.snake.changeDirection(direction);
    }
  }

  update(currentTime) {
    if (!this.running || !this.snake.isAlive()) {
      this.running = false;
      return;
    }

    // ✅ 只有距离上次移动超过设定间隔，才真正移动蛇
    if (currentTime - this.lastMoveTime > this.moveInterval) {

      // 移动蛇
      this.snake.update();
      // 检测是否吃到食物
      const snakeHead = this.snake.getHead();
      const foodPos = this.food.getPosition();

      // 检测是否吃到食物
      if (snakeHead.x === foodPos.x && snakeHead.y === foodPos.y) {
        this.foodEaten++;
        this.snake.grow();
        this.food.respawn(this.gridWidth, this.gridHeight, this.snake.body, this.map);
      }

      // 检测是否通关
      if (this.foodEaten >= this.targetFoodCount) {
        this.running = false; // 暂时结束，可扩展为进入下一关
        console.log('🎉 Level Clear!');
      }

      // ✅ 记录本次移动的时间
      this.lastMoveTime = currentTime;
    }
  }

  reset() {
    this.snake = new Snake(this.gridWidth, this.gridHeight, 3, 3, this.map);
    this.food = null;
    this.running = true;
    this.lastMoveTime = 0;
    this.setupFood();
  }

  render(ctx) {
    // 清空画布
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制墙壁
    ctx.fillStyle = '#8B4513'; // 棕色墙壁
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.map[y][x] === 1) {
          ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }

    // 渲染蛇
    this.snake.render(ctx);

    // 渲染食物
    if (this.food) {
      this.food.render(ctx);
    }

    // 游戏结束提示
    if (!this.snake.isAlive()) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Game Over!',
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      ctx.font = '16px Arial';
      ctx.fillText(
        'Press R to restart',
        this.canvas.width / 2,
        this.canvas.height / 2 + 40
      );
    }

    // 渲染UI：右上角显示 "Food: 2/3"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Food: ${this.foodEaten}/${this.targetFoodCount}`,
      this.canvas.width - 10,
      25
    );
    ctx.fillText(
      `Level: ${this.currentLevel}/8`,
      this.canvas.width - 10,
      45
    );
  }

  isRunning() {
    return this.running && this.snake.isAlive();
  }
}