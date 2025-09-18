import { Snake, DIRECTIONS } from './Snake.js';
import { Food } from './Food.js';

export class EndlessMode {
  /**
   * @param {HTMLCanvasElement} canvas - 游戏画布 DOM 元素
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // 游戏网格大小
    this.gridWidth = 20;
    this.gridHeight = 20;

    // 每个格子的像素大小
    this.tileSize = 20;

    // 初始化蛇和食物
    this.snake = new Snake(this.gridWidth, this.gridHeight);
    this.food = new Food(this.gridWidth, this.gridHeight);

    // 游戏运行状态
    this.running = true;

    // 控制蛇移动的频率（毫秒）
    this.moveInterval = 200; // 🐌 推荐 200ms = 每秒约 5 格，可调整
    this.lastMoveTime = 0;   // 上一次蛇移动的时间戳

    // 绑定键盘输入
    this.setupInput();
  }

  /**
   * 监听键盘事件：方向键控制蛇，R键重置游戏
   */
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

  /**
   * 重置游戏状态：重新初始化蛇和食物，继续新一轮
   */
  reset() {
    this.snake = new Snake(this.gridWidth, this.gridHeight);
    this.food = new Food(this.gridWidth, this.gridHeight);
    this.running = true;
    this.lastMoveTime = 0; // 重置时间，避免立即移动
  }

  /**
   * 游戏主逻辑更新（每帧调用，传入时间戳）
   * @param {number} currentTime - requestAnimationFrame 提供的毫秒级时间戳
   */
  update(currentTime) {
    if (!this.running || !this.snake.isAlive()) {
      this.running = false;
      return;
    }

    // 控制蛇的移动频率
    if (currentTime - this.lastMoveTime > this.moveInterval) {
      this.snake.update(); // 移动蛇

      // 检测是否吃到食物
      const snakeHead = this.snake.getHead();
      const foodPos = this.food.getPosition();

      if (snakeHead.x === foodPos.x && snakeHead.y === foodPos.y) {
        this.snake.grow(); // 蛇变长
        this.food.respawn(
          this.gridWidth,
          this.gridHeight,
          this.snake.body // 确保食物不生成在蛇身上
        );
      }

      // 记录此次移动时间
      this.lastMoveTime = currentTime;
    }
  }

  /**
   * 渲染游戏画面：蛇、食物、Game Over 文字
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    // 清空画布
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染蛇
    this.snake.render(ctx);

    // 渲染食物
    this.food.render(ctx);

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
  }

  /**
   * 当前模式是否仍在运行（用于 Game.js 判断是否继续循环）
   */
  isRunning() {
    return this.running && this.snake.isAlive();
  }
}