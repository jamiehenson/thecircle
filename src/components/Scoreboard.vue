<template>
  <div id="scoreboard">
    <h1>Wheel</h1>
    <p>
      Selected player:
      {{
        selectedSegment !== undefined
          ? players[experts[selectedSegment]].name
          : 'N/A'
      }}
    </p>
    <hr />
    <p>Contestant: {{ players[contestant].name }}</p>
    Experts:
    <ul>
      <li v-for="expert in expertPlayers" :key="expert.name">
        {{ expert.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Scoreboard',
  computed: {
    players() {
      return this.$store.state.players;
    },
    selectedSegment() {
      return this.$store.state.selectedSegment;
    },
    contestant() {
      return this.$store.state.contestant;
    },
    experts() {
      return this.$store.state.experts;
    },
    expertPlayers() {
      const { players, experts } = this.$store.state;
      return players.filter((player: never, index: string) =>
        experts.includes(index)
      );
    }
  }
});
</script>

<style scoped>
#scoreboard {
  flex: 1;
  background: lightslategray;
  color: white;
  padding: 0 2rem;
}
</style>
