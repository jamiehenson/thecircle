<template>
  <div id="stage-wrapper">
    <div id="stage">
      <div
        id="stage-segments"
        :style="{
          transform: `rotate(${spinTarget}deg)`,
          transition: `${spin ? `transform ${spinLength}ms ease-in-out` : ''}`
        }"
      >
        <div
          v-for="(segment, segmentIndex) in segmentContent"
          :key="segmentIndex"
          :style="{
            transform: segmentTransform(segmentIndex, segmentContent.length),
            backgroundColor: segmentColor(segment, segmentIndex, segmentContent.length)
          }"
          :class="{
            'stage-segment': segmentContent.length > 2,
            'stage-segment-half': segmentContent.length === 2,
            'stage-segment-whole': segmentContent.length === 1,
            'stage-segment-interactive': pickExpert || pickShutdown(segment),
            'stage-segment-pick-expert': pickExpert,
            'stage-segment-pick-shutdown': pickShutdown(segment)
          }"
          @click="setSegmentType(segment)"
        >
          <span
            :style="{
              transform: segmentTextTransform(segmentContent.length)
            }"
            class="stage-segment-text"
          >
            {{ `${segment.name}${segment.expert ? ' 👑' : ''}${segment.shutdown ? ' ⛔️' : ''}` }}
          </span>
        </div>
      </div>
      <div class="stage-center">{{ contestant?.name || '?' }}</div>
      <div class="stage-arrow"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameMode, Player } from '@/types';
import { defineComponent } from 'vue';
import { getActiveWheelPlayers, SPIN_LENGTH } from '@/helpers';
import theme from '@/theme';

export default defineComponent({
  name: 'Stage',
  computed: {
    contestant() {
      return this.$store.getters.getContestant;
    },
    expert() {
      return this.$store.getters.getExpert;
    },
    spin() {
      return this.$store.state.spin;
    },
    spinTarget() {
      return this.$store.state.spinTarget;
    },
    segmentContent() {
      const { mode, players, topics } = this.$store.state;
      if (mode === GameMode.PickTopic) {
        return topics;
      } else {
        return getActiveWheelPlayers(players);
      }
    },
    spinLength() {
      return SPIN_LENGTH;
    },
    pickExpert() {
      return this.$store.state.mode === GameMode.PickExpert;
    }
  },
  methods: {
    segmentColor(segment: Player, segmentIndex: number, segmentCount: number) {
      if (segment.expert) {
        return theme['--gold'];
      } else if (segment.shutdown) {
        return theme['--red'];
      } else {
        return `hsl(${360 * (segmentIndex / segmentCount)}, 100%, 80%)`;
      }
    },
    segmentTransform(segmentIndex: number, segmentCount: number) {
      if (segmentCount >= 3) {
        return `rotate(${(360 / segmentCount) * segmentIndex}deg) skewY(${-(90 - 360 / segmentCount)}deg)`;
      } else if (segmentCount === 2) {
        return `rotate(${(360 / segmentCount) * segmentIndex}deg) skewY(0deg)`;
      }
    },
    segmentTextTransform(segmentCount: number) {
      if (segmentCount >= 3) {
        return `skewY(${90 - 360 / segmentCount}deg) rotate(90deg)`;
      } else if (segmentCount === 1) {
        return `translateX(4vh)`;
      }
    },
    setSegmentType(player: Player) {
      if (this.pickExpert) {
        this.$store.dispatch('setPlayerExpert', player.id);
      } else if (this.pickShutdown(player)) {
        this.$store.dispatch('setPlayerShutdown', player.id);
      }
    },
    pickShutdown(player: Player) {
      return this.$store.state.mode === GameMode.PickShutdown && player.id !== this.expert?.id;
    }
  }
});
</script>

<style scoped>
#stage-wrapper {
  background-color: var(--blue2);
}
#stage,
#stage-segments {
  height: 90vh;
  width: 90vh;
  position: relative;
  overflow: hidden;
}
#stage {
  margin: 5vh;
  border-radius: 100%;
  border: 2px solid white;
}
.stage-segment,
.stage-segment-half,
.stage-segment-whole {
  border: 2px solid white;
  position: absolute;
  transition: background-color 0.25s ease-in-out, transform 1s ease-in-out;
  transform: rotate(90deg);
}
.stage-segment {
  top: -10vh;
  left: 45vh;
  width: 55vh;
  height: 55vh;
  transform-origin: bottom left;
}
.stage-segment-half {
  top: -2vh;
  left: 45vh;
  height: 94vh;
  width: 45vh;
  transform-origin: center left;
}
.stage-segment-whole {
  top: -2vh;
  left: -2vh;
  width: 94vh;
  height: 94vh;
}
.stage-segment-interactive {
  cursor: pointer;
}
.stage-segment-pick-expert:hover {
  background-color: var(--gold) !important;
}
.stage-segment-pick-shutdown:hover {
  background-color: var(--red) !important;
}
.stage-segment-text {
  font-size: 2vh;
  font-size: 3vh;
  font-weight: bold;
  text-transform: uppercase;
  position: absolute;
  bottom: 43vh;
  color: var(--white);
  user-select: none;
  text-shadow: 0px 0px 3px var(--black);
  max-width: 30vh;
  transform-origin: bottom left;
}
.stage-segment-half .stage-segment-text {
  bottom: auto;
  transform: rotate(90deg);
}
.stage-center {
  left: 35vh;
  top: 35vh;
  height: 20vh;
  width: 20vh;
  background-color: var(--blue1);
  position: absolute;
  border-radius: 100%;
  z-index: 1;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3vh;
  font-weight: bold;
  border: 2px solid white;
  user-select: none;
  padding: 2vh;
  box-sizing: border-box;
  text-align: center;
  word-break: all;
}
.stage-arrow {
  left: 44vh;
  top: 45vh;
  height: 30vh;
  width: 2vh;
  background-color: var(--white);
  position: absolute;
  border-bottom-left-radius: 1vh;
  border-bottom-right-radius: 1vh;
  pointer-events: none;
}
</style>
