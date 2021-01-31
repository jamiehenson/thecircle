<template>
  <div id="scoreboard">
    <h1>Wheel</h1>
    <p>
      Selected player:
      {{
        selectedSegment !== undefined
          ? nonContestants[selectedSegment].name
          : 'N/A'
      }}
    </p>
    <hr />
    <p>Contestant: {{ contestant.name }}</p>
    <p>
      Non-contestants: {{ nonContestants.map(({ name }) => name).join(', ') }}
    </p>
    <p>Topic: N/A</p>
    <p>Expert: {{ expert ? expert.name : 'N/A' }}</p>
    <p>Shutdown: {{ shutdown ? shutdown.name : 'N/A' }}</p>
  </div>
</template>

<script lang="ts">
import { Player } from '@/store';
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
