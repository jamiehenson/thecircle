<template>
  <div id="stage">
    <div
      v-for="(player, playerIndex) in players"
      :key="player.name"
      :style="{
        transform: `rotate(${(360 / players.length) * playerIndex}deg)`
      }"
      class="stage-segment"
    >
      <span
        :style="{
          transform: `rotate(${180 / players.length}deg)`
        }"
        class="stage-segment-text"
      >
        {{ player.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Stage',
  props: {
    players: {
      type: Array,
      default: () => []
    }
  }
})
</script>

<style scoped>
#stage {
  margin: 5vh;
  height: 90vh;
  width: 90vh;
  border-radius: 100%;
  background: blue;
  position: relative;
  transition: transform;
}
.stage-segment {
  border-left: 2px solid white;
  position: absolute;
  top: 0;
  left: 45vh;
  width: 22.5vh;
  height: 45vh;
  transform: rotate(90deg);
  transform-origin: bottom left;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.stage-segment-text {
  font-size: 1rem;
  font-size: 3vh;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
