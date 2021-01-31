<template>
  <div id="info-box">
    <h1>{{ gameModeHeading }}</h1>
    <Setup v-if="inSetup" />
    <p v-else>{{ contextualMessage }}</p>
    <button @click="closeInfo">Advance</button>
  </div>
</template>

<script lang="ts">
import { gameModeLabels } from '@/store';
import { GameMode, Player, Topic } from '@/types';
import { defineComponent } from 'vue';
import Setup from './Setup.vue';

export default defineComponent({
  name: 'Info',
  components: {
    Setup
  },
  computed: {
    inSetup() {
      return this.$store.state.gameState.mode === GameMode.Setup;
    },
    gameModeHeading() {
      return gameModeLabels[this.$store.state.gameState.mode as GameMode];
    },
    contextualMessage() {
      const { mode } = this.$store.state.gameState;
      switch (mode) {
        case GameMode.PickTopic:
          return `Contestant: ${
            this.$store.state.players.find(
              (player: Player) => player.contestant
            )?.name
          }`;
        case GameMode.PickAssistant:
          return `Topic: ${
            this.$store.state.topics.find((topic: Topic) => topic.active)?.name
          }`;
        case GameMode.AnswerQuestion:
          return `Assistant: ${
            this.$store.state.players.find((player: Player) => player.assistant)
              ?.name
          }`;
        default:
          return "Let's go!";
      }
    }
  },
  methods: {
    closeInfo() {
      this.$store.commit('closeInfo');
    }
  }
});
</script>

<style scoped>
#info-box {
  background: black;
  color: white;
  position: absolute;
  width: 60vh;
  left: 20vh;
  top: 5vh;
  padding: 3vh;
  border-radius: 2vh;
  box-sizing: border-box;
  z-index: 1;
  text-align: center;
  max-height: 90vh;
  overflow-y: scroll;
}
h1 {
  margin-top: 0;
}
button {
  font-size: 3vh;
  padding: 1vh;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 1vh;
  border: 0;
}
</style>
