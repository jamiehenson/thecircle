<template>
  <div id="scoreboard">
    <h1>THE CIRCLE</h1>
    <h4>-- Now: {{ gameMode }} --</h4>
    <p v-if="contestant">Now playing:</p>
    <div v-if="contestant" id="contestant-box">
      <h2>{{ contestant.name }} - £{{ contestant.score }}</h2>
      <div id="contestant-box-info">
        <div class="contestant-box-info-item">Topic: {{ topic?.name || '?' }}</div>
        <div class="contestant-box-info-item">Expert: {{ expert?.name || '?' }}</div>
        <div class="contestant-box-info-item">Shutdown: {{ shutdown?.name || '?' }}</div>
        <div class="contestant-box-info-item">Assistant: {{ assistant?.name || '?' }}</div>
      </div>
    </div>
    <p v-if="contestant">Other players:</p>
    <div id="non-contestant-boxes">
      <div
        v-for="(nonContestant, nonContestantIndex) in nonContestants"
        :key="nonContestant.id"
        class="non-contestant-box"
        :style="{ backgroundColor: `hsl(${360 * (nonContestantIndex / nonContestants.length)}, 100%, 80%)` }"
      >
        <div class="non-contestant-box-inner">
          <h3>
            {{ nonContestant.name }}
            {{ nonContestant.expert ? '👑' : '' }}
            {{ nonContestant.shutdown ? '⛔️' : '' }}
            {{ nonContestant.assistant ? '🧠' : '' }}
          </h3>
          <div class="non-contestant-box-info">💷 £{{ nonContestant.score }}</div>
          <div class="non-contestant-box-info">🧠 {{ nonContestant.assistanceScore }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { gameModeActionLabels } from '@/helpers';
import { Player } from '@/types';
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
    topics() {
      return this.$store.state.topics;
    },
    nonContestants() {
      return this.$store.state.players.filter((player: Player) => !player.contestant);
    },
    gameMode() {
      return gameModeActionLabels(this.$store.state.mode);
    }
  }
});
</script>

<style scoped>
#scoreboard {
  flex: 1;
  background-color: var(--blue5);
  color: var(--white);
  padding: 0 2vh;
}
h1,
h4 {
  text-align: center;
}
h2,
h3,
h4 {
  margin-top: 0;
}
p {
  font-size: 1.2rem;
  font-weight: bold;
}
#contestant-box,
.non-contestant-box {
  border-radius: 1vh;
  border: 2px solid var(--white);
  text-shadow: 0 0 3px var(--black);
}
#contestant-box {
  background-color: var(--blue);
  margin-bottom: 2vh;
  padding: 1rem;
}
.contestant-box-info-item {
  font-weight: bold;
}
#non-contestant-boxes,
#contestant-box-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2vh;
}
.non-contestant-box-info {
  width: 50%;
  display: inline-block;
  min-width: 80px;
  font-weight: bold;
  font-size: 1rem;
}
.non-contestant-box-inner {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
</style>
