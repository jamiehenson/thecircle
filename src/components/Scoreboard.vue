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
    selectedSegment() {
      return this.$store.state.selectedSegment;
    },
    contestant() {
      return this.$store.state.players.find(
        (player: Player) => player.contestant
      );
    },
    assistant() {
      return this.$store.state.players.find(
        (player: Player) => player.assistant
      );
    },
    nonContestants() {
      return this.$store.state.players.filter(
        (player: Player) => !player.contestant
      );
    },
    expert() {
      return this.$store.state.players.find((player: Player) => player.expert);
    },
    shutdown() {
      return this.$store.state.players.find(
        (player: Player) => player.shutdown
      );
    },
    gameMode() {
      return gameModeLabels[this.$store.state.gameState.mode as GameMode];
    },
    topic() {
      return this.$store.state.topics.find((topic: Topic) => topic.active);
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
