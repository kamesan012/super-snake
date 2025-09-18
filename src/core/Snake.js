// 方向常量，便于理解与比较
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// 限制方向队列长度，避免无限堆积
const MAX_DIRECTION_QUEUE_LENGTH = 3;

export class Snake {
  /**
   * @param {number} gridWidth - 游戏网格宽度
   * @param {number} gridHeight - 游戏网格高度
   * @param {number} [startX=10] - 蛇头 X 坐标（可选，默认 10）
   * @param {number} [startY=10] - 蛇头 Y 坐标（可选，默认 10）
   */
  constructor(gridWidth, gridHeight, startX = 10, startY = 10, map = null) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    // ✅ 根据传入的 startX / startY 初始化蛇身体
    this.body = [
      { x: startX, y: startY },     // 蛇头
      { x: startX - 1, y: startY }, // 第一节身体
      { x: startX - 2, y: startY }, // 第二节身体
    ];

    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.directionQueue = [];
    this.shouldGrow = false;
    this.alive = true;
    this.map = map; // 可选的地图，用于检测障碍物
  }

  /**
   * 改变蛇的移动方向（用户输入）
   * 注意：不能直接反向，比如向右时不能直接向左
   * @param {Object} newDirection - 如 {x: 1, y: 0} 表示向右
   */
  changeDirection(newDirection) {
    const goingReverse =
      (this.direction.x === -newDirection.x && this.direction.y === -newDirection.y);

    if (!goingReverse) {
      this.directionQueue.push(newDirection);

      // 只保留最近 MAX_DIRECTION_QUEUE_LENGTH 个方向
      if (this.directionQueue.length > MAX_DIRECTION_QUEUE_LENGTH) {
        this.directionQueue.shift(); // 移除最旧的输入
      }
    }
  }

  /**
   * 每帧调用：更新蛇的位置（移动一格）
   */
  update() {
    if (!this.alive) return;

    // ✅ 从队列中取出最早按下的方向（FIFO），如果队列有值，则使用它
    if (this.directionQueue.length > 0) {
      const nextDir = this.directionQueue.shift(); // 取出第一个方向
      // 验证该方向是否合法（非反向）
      const isReverse =
        (this.direction.x === -nextDir.x && this.direction.y === -nextDir.y);
      if (!isReverse) {
        this.direction = nextDir; // 更新为队列中的方向
      }
      // 如果是反向，可以选择丢弃或忽略（我们选择忽略）
    }

    // 如果队列为空，则继续使用当前方向（或 nextDirection，如果你保留它）
    // 当前逻辑：如果没有队列输入，蛇会保持原方向移动

    // 计算新的蛇头
    const head = { ...this.body[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    // 碰撞检测：墙壁、自身
    if (
      head.x < 0 || head.x >= this.gridWidth ||
      head.y < 0 || head.y >= this.gridHeight ||
      (this.map && this.map[head.y][head.x] === 1) // 碰到墙壁（如果有地图）
    ) {
      this.alive = false;
      return;
    }

    for (let i = 0; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        this.alive = false;
        return;
      }
    }

    this.body.unshift(head);

    if (!this.shouldGrow) {
      this.body.pop();
    }

    this.shouldGrow = false;
  }

  /**
   * 吃到食物时调用：保留尾部，蛇变长
   */
  grow() {
    this.shouldGrow = true;
  }

  /**
   * 渲染蛇（交给 EndlessMode 调用，传入 ctx）
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    this.body.forEach((segment, index) => {
      if (index === 0) {
        // 蛇头 - 用不同颜色
        ctx.fillStyle = '#00ff00'; // 绿色蛇头
      } else {
        // 蛇身
        ctx.fillStyle = '#00aa00'; // 深绿蛇身
      }

      ctx.fillRect(
        segment.x * 20, // 假设每个格子宽度为 20px
        segment.y * 20,
        20, 20
      );
    });
  }

  /**
   * 获取蛇头位置
   */
  getHead() {
    return this.body[0];
  }

  /**
   * 检查蛇是否存活
   */
  isAlive() {
    return this.alive;
  }

  /**
   * 检查指定的坐标 (x, y) 是否被蛇身体的任何一节占据
   * @param {number} x - 要检查的 X 坐标
   * @param {number} y - 要检查的 Y 坐标
   * @returns {boolean} - 如果被蛇身占据，返回 true；否则返回 false
   */
  isOccupying(x, y) {
    for (let i = 0; i < this.body.length; i++) {
      if (this.body[i].x === x && this.body[i].y === y) {
        return true;
      }
    }
    return false;
  }
}