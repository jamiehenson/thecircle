<template>
  <div id="info-bg">
    <div id="info-box">
      <h1>{{ gameModeHeading }}</h1>
      <div v-if="inSetup">
        <Setup />
        <button @click="startGame">Start New Game</button>
      </div>
      <div v-else-if="inQuestion">
        <Question />
      </div>
      <div v-else>
        <p>{{ contextualMessage }}</p>
        <button @click="closeInfo">ADVANCE</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameMode, Player, Topic } from '@/types';
import { defineComponent } from 'vue';
import Setup from './Setup.vue';
import Question from './Question.vue';
import { gameModeLabels } from '@/helpers';

export default defineComponent({
  name: 'Info',
  components: {
    Setup,
    Question
  },
  computed: {
    inSetup() {
      return this.$store.state.mode === GameMode.Setup;
    },
    inQuestion() {
      return this.$store.state.mode === GameMode.AnswerQuestion;
    },
    gameModeHeading() {
      return gameModeLabels[this.$store.state.mode as GameMode];
    },
    contextualMessage() {
      const { mode } = this.$store.state;
      const { PickTopic, PickExpert, PickShutdown, PickAssistant } = GameMode;
      switch (mode) {
        case PickTopic:
          return `Contestant: ${this.$store.getters.getContestant.name}`;
        case PickExpert:
          return `Topic: ${this.$store.getters.getTopic.name}`;
        case PickShutdown:
          return `Expert: ${this.$store.getters.getExpert.name}`;
        case PickAssistant:
          return `Shutdown: ${this.$store.getters.getShutdown.name}`;
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
  background-color: rgba(0, 0, 0, 0.8);
}
#info-box {
  background-color: var(--blue);
  border: 2px solid white;
  color: var(--white);
  margin: 5vh auto;
  width: 60vh;
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
  font-size: 4vh;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
