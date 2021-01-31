<template>
  <div id="wrapper">
    <Stage />
    <Scoreboard />
    <Info v-if="showInfo()" />
    <div id="controls">
      <div @click="spinAndAdvance">🌀</div>
      <div @click="openSettings">⚙️</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Stage from './components/Stage.vue';
import Scoreboard from './components/Scoreboard.vue';
import Info from './components/Info.vue';
import { GameMode } from './types';

export default defineComponent({
  name: 'App',
  components: {
    Stage,
    Scoreboard,
    Info
  },
  methods: {
    spinAndAdvance() {
      this.$store.dispatch('spinAndAdvance');
    },
    openSettings() {
      this.$store.dispatch('changeGameMode', GameMode.Setup);
    },
    showInfo() {
      return this.$store.state.gameState.showInfo;
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
#controls {
  font-size: 2rem;
  position: absolute;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: white;
}
</style>
