<template>
  <div>
    <div id="stage">
      <div
        id="stage-segments"
        :style="`${`transform: rotate(${spinTarget}deg), transition: ${
          spin ? 'transition: transform 5s ease-in-out;' : ''
        }`}`"
      >
        <div
          v-for="(player, playerIndex) in players"
          :key="player.name"
          :style="{
            transform: `rotate(${
              (360 / players.length) * playerIndex
            }deg) skewY(${-(90 - 360 / players.length)}deg)`,
            backgroundColor: `hsl(${
              360 * (playerIndex / players.length)
            }, 100%, 50%)`
          }"
          class="stage-segment"
        >
          <span
            :style="{
              transform: `skewY(${90 - 360 / players.length}deg)`
            }"
            class="stage-segment-text"
          >
            {{ player.name }}
          </span>
        </div>
      </div>
      <div class="stage-center"></div>
      <div class="stage-arrow"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Stage',
  computed: {
    players() {
      return this.$store.state.players;
    },
    spin() {
      return this.$store.state.spin;
    },
    spinTarget() {
      return this.$store.state.spinTarget;
    }
  }
});
</script>

<style scoped>
#stage,
#stage-segments {
  height: 90vh;
  width: 90vh;
  position: relative;
  overflow: hidden;
}
#stage {
  margin: 5vh;
  border-radius: 100%;
  background: blue;
}
.stage-segment {
  border: 2px solid white;
  position: absolute;
  top: -10vh;
  left: 45vh;
  width: 55vh;
  height: 55vh;
  transform: rotate(90deg);
  transform-origin: bottom left;
}
.stage-segment-text {
  font-size: 1rem;
  font-size: 3vh;
  font-weight: bold;
  text-transform: uppercase;
  position: absolute;
  bottom: 10vh;
  left: 10vh;
  color: white;
  user-select: none;
}
.stage-center {
  left: 40vh;
  top: 40vh;
  height: 10vh;
  width: 10vh;
  background: red;
  position: absolute;
  border-radius: 100%;
  z-index: 1;
}
.stage-arrow {
  left: calc(45vh - 10px);
  top: 45vh;
  height: 30vh;
  width: 20px;
  background: white;
  position: absolute;
}
</style>
