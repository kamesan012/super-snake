import { EndlessMode } from './EndlessMode.js'; 
import { LevelMode } from './LevelMode.js';

export class Game {
  /**
   * 构造函数
   * @param {HTMLCanvasElement} canvas - 游戏画布 DOM 元素
   * @param {string} modeType - 模式类型，比如 'endless' | 'level'
   */
  constructor(canvas, modeType) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.modeType = modeType;
    this.mode = null; // 当前游戏模式实例，比如 EndlessMode
    this.isRunning = false;
    this.lastTime = 0;

    // 待初始化：renderer, input, mode
    this.init();
  }

  /**
   * 初始化游戏：根据模式创建对应模式实例
   */
  init() {
    // 根据 modeType 创建不同的游戏模式（目前只处理 endless）
    switch (this.modeType) {
      case 'endless':
        this.mode = new EndlessMode(this.canvas, this.ctx);
        break;
      case 'level':
        this.mode = new LevelMode(this.canvas, this.ctx);
        break;
      default:
        throw new Error(`Unknown game mode: ${this.modeType}`);
    }

    // 启动游戏循环
    this.start();
  }

  /**
   * 启动游戏主循环
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.gameLoop(); // 开始循环
  }

  /**
   * 停止游戏（清理循环）
   */
  stop() {
    this.isRunning = false;
    // 如果需要清理事件、计时器等，可以在这里做
  }

  /**
   * 游戏主循环：使用 requestAnimationFrame
   * @param {number} currentTime - 当前时间戳（由浏览器传入）
   */
  gameLoop(currentTime = 0) {
    if (!this.isRunning) return;

    // 直接将时间戳传递给 mode
    this.update(currentTime);  // 不再传递 deltaTime，而是时间戳
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * 更新游戏逻辑（每帧调用）
   * @param {number} deltaTime - 帧间隔时间（毫秒）
   */
  update(currentTime) {
    if (this.mode) {
      this.mode.update(currentTime); // EndlessMode 将接收真正的时间戳
    }
  }

  /**
   * 渲染游戏画面（每帧调用）
   */
  render() {
    // 清空画布
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 调用当前模式的渲染方法
    if (this.mode) {
      this.mode.render(this.ctx);
    }
  }
}