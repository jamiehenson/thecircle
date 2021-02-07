<template>
  <div id="wrapper" :style="theme">
    <Stage />
    <Scoreboard />
    <transition name="fade">
      <Info v-if="showInfo" />
    </transition>
    <div id="controls">
      <transition name="fade">
        <div
          v-if="showSpin"
          :class="{ spinning: spin }"
          @click="spinAndAdvance"
        >
          🌀
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Stage from './components/Stage.vue';
import Scoreboard from './components/Scoreboard.vue';
import Info from './components/Info.vue';
import { GameMode } from './types';
import theme from './theme';

export default defineComponent({
  name: 'App',
  components: {
    Stage,
    Scoreboard,
    Info
  },
  computed: {
    spin() {
      return this.$store.state.spin;
    },
    showInfo() {
      return this.$store.state.showInfo;
    },
    showSpin() {
      return ![GameMode.PickExpert, GameMode.PickShutdown].includes(
        this.$store.state.mode
      );
    },
    theme() {
      return theme;
    }
  },
  methods: {
    spinAndAdvance() {
      this.$store.dispatch('spinAndAdvance');
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
  font-size: 8vh;
  position: absolute;
  margin: 1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--white);
}
.spinning {
  animation: spin 1s infinite linear;
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
button {
  font-size: 2vh;
  padding: 1vh;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 1vh;
  border: 0;
  font-family: Avenir, Helvetica, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
  margin-top: 3vh;
}
button:hover:not(:disabled) {
  background-color: var(--grey);
}
button:focus {
  outline: none;
}
</style>
