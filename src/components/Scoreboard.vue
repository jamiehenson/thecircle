<template>
  <div id="scoreboard">
    <h1>The Circle</h1>
    <p>Stage: {{ gameMode }}</p>
    <p>
      Non-contestants: {{ nonContestants.map(({ name }) => name).join(', ') }}
    </p>
    <hr />
    <p>Contestant: {{ contestant?.name || '?' }}</p>
    <p>Topic: {{ topic?.name || '?' }}</p>
    <p>Expert: {{ expert?.name || '?' }}</p>
    <p>Shutdown: {{ shutdown?.name || '?' }}</p>
    <p>Assistant: {{ assistant?.name || '?' }}</p>
    <hr />
    <h3>Scores:</h3>
    <ul>
      <li v-for="player in players" :key="player.name">
        {{ player.name }}: {{ player.score }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { gameModeLabels } from '@/helpers';
import { GameMode, Player, Topic } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Scoreboard',
  computed: {
    players() {
      return this.$store.state.players;
    },
    contestant() {
      return this.$store.getters.getContestant;
    },
    expert() {
      return this.$store.getters.getExpert;
    },
    shutdown() {
      return this.$store.getters.getShutdown;
    },
    assistant() {
      return this.$store.getters.getAssistant;
    },
    topic() {
      return this.$store.getters.getTopic;
    },
    selectedSegment() {
      return this.$store.state.selectedSegment;
    },
    state() {
      return this.$store.state;
    },
    nonContestants() {
      return this.$store.state.players.filter(
        (player: Player) => !player.contestant
      );
    },
    gameMode() {
      return gameModeLabels[this.$store.state.mode as GameMode];
    }
  }
});
</script>

<style scoped>
#scoreboard {
  flex: 1;
  background-color: var(--grey1);
  color: var(--white);
  padding: 0 2vh;
}
</style>
