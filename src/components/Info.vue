<template>
  <div id="info-bg">
    <div id="info-box">
      <h1>{{ gameModeHeading }}</h1>
      <Setup v-if="inSetup" />
      <p v-else>{{ contextualMessage }}</p>
      <button v-if="inSetup" @click="startGame">Start New Game</button>
      <button v-else @click="closeInfo">ADVANCE</button>
    </div>
  </div>
</template>

<script lang="ts">
import { gameModeLabels } from '@/helpers';
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
      const {
        PickTopic,
        PickExpert,
        PickShutdown,
        PickAssistant,
        AnswerQuestion
      } = GameMode;
      switch (mode) {
        case PickTopic:
          return `Contestant: ${
            this.$store.state.players.find(
              (player: Player) => player.contestant
            )?.name
          }`;
        case PickExpert:
          return `Topic: ${
            this.$store.state.topics.find((topic: Topic) => topic.active)?.name
          }`;
        case PickShutdown:
          return `Expert: ${
            this.$store.state.players.find((player: Player) => player.expert)
              ?.name
          }`;
        case PickAssistant:
          return `Shutdown: ${
            this.$store.state.players.find((player: Player) => player.shutdown)
              ?.name
          }`;
        case AnswerQuestion:
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
    startGame() {
      this.$store.dispatch('changeGameMode', GameMode.PickContestant);
      this.$store.commit('closeInfo');
    },
    closeInfo() {
      this.$store.commit('closeInfo');
    }
  }
});
</script>

<style scoped>
#info-bg {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
#info-box {
  background: #152238;
  border: 2px solid white;
  color: white;
  position: absolute;
  width: 60vh;
  left: 20vh;
  top: 5vh;
  padding: 3vh;
  border-radius: 2vh;
  box-sizing: border-box;
  z-index: 2;
  text-align: center;
  max-height: 90vh;
  overflow-y: scroll;
}
h1 {
  margin-top: 0;
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
  transition: background 0.2s ease-in-out;
  margin-top: 3vh;
}
button:hover {
  background: lightgrey;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
