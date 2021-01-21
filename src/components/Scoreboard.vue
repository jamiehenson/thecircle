<template>
  <div id="scoreboard">
    <h1>Scoreboard</h1>
    <ul>
      <li v-for="player in players" :key="player.name">{{ player.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Scoreboard',
  props: {
    players: {
      type: Array,
      default: () => []
    }
  }
})
</script>

<style scoped>
#scoreboard {
  flex: 1;
  background: lightslategray;
  color: white;
  padding: 0 2rem;
}
</style>
