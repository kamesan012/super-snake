<template>
  <div class="menu">
    <h1>🐍 贪吃蛇大作战</h1>
    <div class="buttons">
      <button @click="handleStart('endless')">🔓 无尽模式</button>
      <button @click="handleStart('level')">🏆 通关模式</button>
    </div>
  </div>
</template>

<script setup>
// 定义事件：向父组件传递选择的模式
const emit = defineEmits(['start'])

const handleStart = (mode) => {
  emit('start', mode)
}
</script>

<style scoped>
.menu {
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 40px;
  color: #0f0;
}

.buttons button {
  display: block;
  width: 200px;
  margin: 15px auto;
  padding: 15px;
  font-size: 1.2em;
  border: none;
  border-radius: 8px;
  background: #0a4d0a;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.buttons button:hover {
  background: #0f6b0f;
}
</style>