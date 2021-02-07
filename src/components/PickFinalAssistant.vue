<template>
  <div id="question-box">
    <h2>{{ contestant.name }}</h2>
    <div id="answers-box">
      <button
        v-for="(nonContestant, nonContestantIndex) in nonContestants"
        :key="nonContestant.id"
        :class="nonContestantClass(nonContestants, nonContestantIndex)"
        :disabled="isDisabled(nonContestant, nonContestants, nonContestantIndex)"
        @click="pickFinalAssistant(nonContestant, nonContestantScoreMultiplier(nonContestants, nonContestantIndex))"
      >
        {{ nonContestantLabel(nonContestant, nonContestants, nonContestantIndex) }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { UI_INTERACTION_LENGTH } from '@/helpers';
import { Player } from '@/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PickFinalAssistant',
  data(): { selectedAssistant: Player | null } {
    return {
      selectedAssistant: null
    };
  },
  computed: {
    contestant() {
      return this.$store.getters.getContestant;
    },
    nonContestants() {
      const nonContestants = this.$store.getters.getNonContestants;
      return nonContestants?.sort((a: Player, b: Player) => b.assistanceScore - a.assistanceScore);
    }
  },
  methods: {
    pickFinalAssistant(nonContestant: Player, scoreMultiplier: number) {
      this.$data.selectedAssistant = nonContestant;

      setTimeout(() => {
        this.$store.dispatch('pickFinalAssistant', { ...nonContestant, scoreMultiplier });
      }, UI_INTERACTION_LENGTH);
    },
    isDisabled(nonContestant: Player, nonContestants: Player[], nonContestantIndex: number) {
      if (this.$data.selectedAssistant) {
        return this.$data.selectedAssistant !== nonContestant;
      } else {
        const acceptedIndices = [0, Math.floor((nonContestants.length - 1) / 2), nonContestants.length - 1];
        return !acceptedIndices.includes(nonContestantIndex);
      }
    },
    nonContestantClass(nonContestants: Player[], nonContestantIndex: number) {
      const nonContestantsZeroedCount = nonContestants.length - 1;
      if (nonContestantIndex === 0) {
        return 'non-contestant-expert';
      } else if (nonContestantIndex === Math.floor(nonContestantsZeroedCount / 2)) {
        return 'non-contestant-mid';
      } else if (nonContestantIndex === nonContestantsZeroedCount) {
        return 'non-contestant-shutdown';
      }
    },
    nonContestantScoreMultiplier(nonContestants: Player[], nonContestantIndex: number) {
      const nonContestantsZeroedCount = nonContestants.length - 1;
      if (nonContestantIndex === 0) {
        return 0.5;
      } else if (nonContestantIndex === Math.floor(nonContestantsZeroedCount / 2)) {
        return 1;
      } else if (nonContestantIndex === nonContestantsZeroedCount) {
        return 2;
      }
    },
    nonContestantLabel(nonContestant: Player, nonContestants: Player[], nonContestantIndex: number) {
      const multiplier = this.nonContestantScoreMultiplier(nonContestants, nonContestantIndex);

      if (multiplier) {
        return `${nonContestant.name} - £${this.contestant.score * multiplier}`;
      } else {
        return nonContestant.name;
      }
    }
  }
});
</script>

<style scoped>
.non-contestant-expert:not(:disabled),
.non-contestant-mid:not(:disabled),
.non-contestant-shutdown:not(:disabled) {
  text-shadow: 0 0 3px var(--black);
}
.non-contestant-expert:not(:disabled) {
  background-color: var(--gold);
  color: var(--white);
}
.non-contestant-expert:hover:not(:disabled) {
  background-color: var(--gold1);
}
.non-contestant-mid:not(:disabled) {
  background-color: var(--blue);
  color: var(--white);
}
.non-contestant-mid:hover:not(:disabled) {
  background-color: var(--blue4);
}
.non-contestant-shutdown:not(:disabled) {
  background-color: var(--red1);
  color: var(--white);
}
.non-contestant-shutdown:hover:not(:disabled) {
  background-color: var(--red2);
}
</style>
