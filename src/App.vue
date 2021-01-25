<template>
  <div id="wrapper">
    <Stage :spin="spin" />
    <Scoreboard />
    <div id="counter">
      <div @click="increasePlayers">+</div>
      <div @click="decreasePlayers">-</div>
      <div @click="spin">🌀</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Stage from './components/Stage.vue';
import Scoreboard from './components/Scoreboard.vue';

export default defineComponent({
  name: 'App',
  components: {
    Stage,
    Scoreboard
  },
  methods: {
    increasePlayers() {
      this.$store.commit('increasePlayers');
    },
    decreasePlayers() {
      this.$store.commit('decreasePlayers');
    },
    spin() {
      this.$store.commit('spin');
    }
  }
});
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
</style>
