<template>
  <div id="app">
    <!-- 开始菜单 -->
    <GameMenu v-if="gameState === 'menu'" @start="onStartGame" />

    <!-- 游戏画布 -->
    <GameCanvas
      v-if="gameState === 'playing'"
      :mode="selectedMode"
      @back-to-menu="onBackToMenu"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameMenu from './components/GameMenu.vue'
import GameCanvas from './components/GameCanvas.vue'

const gameState = ref('menu') // 'menu' | 'playing'
const selectedMode = ref('endless') // 'endless' | 'level'

const onStartGame = (mode) => {
  selectedMode.value = mode
  gameState.value = 'playing'
}

const onBackToMenu = () => {
  gameState.value = 'menu'
}
</script>

<style>
#app {
  text-align: center;
  margin: 0;
  padding: 0;
  background: #111;
  color: white;
  font-family: Arial, sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>