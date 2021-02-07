<template>
  <div id="question-box">
    <p>Assistant: {{ assistant?.name }}</p>
    <h2>{{ currentQuestion.question }}</h2>
    <div id="answers-box">
      <button
        v-for="answer in currentQuestion.answers"
        :key="answer.answer"
        :style="{
          backgroundColor: answerClass(answer),
          color: isSelectedAnswer(answer) ? theme['--white'] : theme['--black']
        }"
        :disabled="selectedAnswer && !isSelectedAnswer(answer)"
        @click="answerQuestion(answer)"
      >
        {{ answer.answer }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import theme from '@/theme';
import { UI_INTERACTION_LENGTH } from '@/helpers';
import { Answer, GameMode, Question } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Question',
  data(): { selectedAnswer: Answer | null } {
    return {
      selectedAnswer: null
    };
  },
  computed: {
    assistant() {
      return this.$store.getters.getAssistant;
    },
    currentQuestion() {
      const currentTopic: Question[] = this.$store.state.questions['GENERAL_KNOWLEDGE'];
      return currentTopic[Math.floor(Math.random() * currentTopic.length)];
    },
    theme() {
      return theme;
    }
  },
  methods: {
    isSelectedAnswer(answer: Answer) {
      return this.selectedAnswer?.answer === answer.answer;
    },
    answerQuestion(answer: Answer) {
      this.selectedAnswer = answer;

      setTimeout(() => {
        if (answer.correct) {
          if (this.$store.state.finalQuestion) {
            this.$store.dispatch('changeGameMode', GameMode.EndGame);
          } else {
            this.$store.dispatch('goToNextQuestion');
          }
        } else {
          this.$store.dispatch('playerHasAttemptedFinalQuestion', this.$store.getters.getContestant);
          this.$store.dispatch('changeGameMode', GameMode.PickContestant);
        }
      }, UI_INTERACTION_LENGTH);
    },
    answerClass(answer: Answer) {
      if (this.isSelectedAnswer(answer)) {
        return answer.correct ? theme['--green'] : theme['--red1'];
      }
    }
  }
});
</script>

<style scoped>
#answers-box {
  display: flex;
  flex-flow: row wrap;
}
#answers-box button {
  width: calc(50% - 2vh);
  margin: 1vh;
  box-sizing: border-box;
}
</style>
