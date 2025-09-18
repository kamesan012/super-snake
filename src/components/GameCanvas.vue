<template>
  <div class="game-container">
    <canvas ref="gameCanvas" width="400" height="400"></canvas>
    <div class="back-button">
      <button @click="handleBack">⬅️ 返回菜单</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Game } from '../core/Game'

// 定义 props
const props = defineProps({
  mode: {
    type: String,
    required: true, // 'endless' | 'level'
  },
})

// 定义事件
const emit = defineEmits(['back-to-menu'])

// 获取 canvas 引用
const gameCanvas = ref(null)

// 游戏实例（后面引入 Game 类后赋值）
let game = null

// 启动游戏
const initGame = async () => {
  game = new Game(gameCanvas.value, props.mode)
  game.start()
}

// 返回菜单
const handleBack = () => {
  emit('back-to-menu')
}

// 生命周期
onMounted(() => {
  initGame()
})

onBeforeUnmount(() => {
  if (game) {
    game.stop?.() // 如果有 stop 方法就调用以清理
  }
})
</script>

<style scoped>
.game-container {
  position: relative;
}

canvas {
  border: 2px solid #0f0;
  background: #000;
}

.back-button button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1em;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button button:hover {
  background: #666;
}
</style>