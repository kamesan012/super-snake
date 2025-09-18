export class Food {
  /**
   * @param {number} gridWidth 
   * @param {number} gridHeight 
   */
  constructor(gridWidth, gridHeight, x, y) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.position = { x: 0, y: 0 };
    if (x && y) {
      this.position = { x, y };
    } else {
      this.generate();
    }
  }

  /**
   * 随机生成新的食物位置
   */
  generate() {
    this.position = {
      x: Math.floor(Math.random() * this.gridWidth),
      y: Math.floor(Math.random() * this.gridHeight),
    };
  }

  /**
   * 渲染食物（一个小方块，红色）
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    ctx.fillStyle = '#ff0000'; // 红色食物
    ctx.fillRect(
      this.position.x * 20,
      this.position.y * 20,
      20, 20
    );
  }

  /**
   * 获取食物位置
   */
  getPosition() {
    return this.position;
  }

  /**
   * 重新生成食物（可被 EndlessMode 调用，确保不在蛇身上）
   */
  respawn(gridWidth, gridHeight, snakeBody, map = null) {
    let newpos;
    let validPosition = false;

    while (!validPosition) {
      // 随机生成新位置
      newpos = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };

      // 1. 始终检测：是否与蛇身重叠
      const isOnSnake = snakeBody.some(
        segment => segment.x === newpos.x && segment.y === newpos.y
      );

      // 2. 可选检测：是否与墙壁重叠（只有传入了 map 才检测！）
      const isOnWall = map ? map[newpos.y][newpos.x] === 1 : false;

      // 只有在不撞蛇、不撞墙时才认为是合法位置
      validPosition = !isOnSnake && !isOnWall;
    }

    this.position = newpos;
  }
}