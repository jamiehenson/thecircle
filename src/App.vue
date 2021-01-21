<template>
  <div id="wrapper">
    <Stage
      :players="players"
      :style="`${spin ? 'animation: spinner 7s linear infinite' : ''}`"
    />
    <Scoreboard :players="players" />
    <div id="counter">
      <div @click="increasePlayers(true)">+</div>
      <div @click="increasePlayers(false)">-</div>
      <div @click="spinWheel">🌀</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Stage from './components/Stage.vue'
import Scoreboard from './components/Scoreboard.vue'

export default defineComponent({
  name: 'App',
  components: {
    Stage,
    Scoreboard
  },
  data() {
    return {
      players: [
        { name: 'Player 1' },
        { name: 'Player 2' },
        { name: 'Player 3' },
        { name: 'Player 4' }
      ],
      spin: false
    }
  },
  methods: {
    increasePlayers(up: boolean) {
      if (up && this.players.length < 7) {
        this.players.push({ name: 'Player ' + (this.players.length + 1) })
      } else if (!up && this.players.length > 2) {
        this.players = this.players.slice(0, this.players.length - 1)
      }
    },
    spinWheel() {
      this.spin = true
      setTimeout(() => {
        this.spin = false
      }, 3000)
    }
  }
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#wrapper {
  display: flex;
}
#counter {
  font-size: 2rem;
  position: absolute;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
