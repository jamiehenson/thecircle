<template>
  <div id="info-bg">
    <div id="info-box" :class="{ final: inQuestion && inFinalRound }">
      <div v-if="showCredits">
        <h1>THE CIRCLE</h1>
        <h2>Based off that thing on the telly. Made to pass the time during Lockdown 2021 🥴</h2>
        <hr />
        <h3>Code, design: Jamie Henson</h3>
        <h3>Questions: Isabel Davies</h3>
        <hr />
        <button @click="toggleCredits">Cool, thanks</button>
      </div>
      <div v-else-if="inSetup">
        <h1>THE CIRCLE</h1>
        <Setup />
        <button @click="startGame">Start New Game</button>
      </div>
      <div v-else-if="inQuestion">
        <Question />
      </div>
      <div v-else-if="inPickFinalAssistant">
        <PickFinalAssistant />
      </div>
      <div v-else-if="inEndGame">
        <p>{{ contextualMessage }}</p>
        <button @click="startGame">Start New Game</button>
      </div>
      <div v-else>
        <h1>{{ contextualMessage }}</h1>
        <button @click="closeInfo">{{ gameModeHeading }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameMode } from '@/types';
import { defineComponent } from 'vue';
import Setup from './Setup.vue';
import Question from './Question.vue';
import PickFinalAssistant from './PickFinalAssistant.vue';
import { gameModeLabels } from '@/helpers';

export default defineComponent({
  name: 'Info',
  components: {
    Setup,
    Question,
    PickFinalAssistant
  },
  computed: {
    inSetup() {
      return this.$store.state.mode === GameMode.Setup;
    },
    inQuestion() {
      return this.$store.state.mode === GameMode.AnswerQuestion;
    },
    inEndGame() {
      return this.$store.state.mode === GameMode.EndGame;
    },
    inPickFinalAssistant() {
      return this.$store.state.mode === GameMode.PickFinalAssistant;
    },
    inFinalRound() {
      return this.$store.state.finalQuestion;
    },
    showCredits() {
      return this.$store.state.showCredits;
    },
    gameModeHeading() {
      return gameModeLabels(this.$store.state.mode, this.$store.state.finalQuestion);
    },
    contextualMessage() {
      const { mode } = this.$store.state;
      const winnings =
        this.$store.getters.getContestant?.score * (this.$store.getters.getAssistant?.scoreMultiplier || 1);
      switch (mode) {
        case GameMode.PickTopic:
          return `${this.$store.getters.getContestant?.name}, you're up!`;
        case GameMode.PickExpert:
          return `${this.$store.getters.getTopic?.name} is our new topic.`;
        case GameMode.PickShutdown:
          return `${this.$store.getters.getExpert?.name} is the expert on ${this.$store.getters.getTopic?.name}. Who knew?`;
        case GameMode.PickAssistant:
          return `${this.$store.getters.getShutdown?.name} will shut down the round.`;
        case GameMode.EndGame:
          return `Congratulations ${this.$store.getters.getContestant?.name}! You won £${winnings}.`;
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
    },
    toggleCredits() {
      this.$store.commit('toggleCredits');
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
  background-color: var(--blue1);
  border: 2px solid var(--white);
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
#info-box.final {
  background-color: var(--gold);
  text-shadow: 0 0 3px var(--black);
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
