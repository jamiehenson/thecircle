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
            backgroundColor: segmentColor(
              segment,
              segmentIndex,
              segmentContent.length
            )
          }"
          :class="{
            'stage-segment': true,
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
            {{
              `${segment.name}${segment.expert ? ' 👑' : ''}${
                segment.shutdown ? ' ⛔️' : ''
              }`
            }}
          </span>
        </div>
      </div>
      <div class="stage-center">{{ contestant?.name || '?' }}</div>
      <div class="stage-arrow"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameMode, Player, Topic } from '@/types';
import { defineComponent } from 'vue';
import { SPIN_LENGTH } from '@/helpers';

export default defineComponent({
  name: 'Stage',
  computed: {
    players() {
      return this.$store.state.players;
    },
    spin() {
      return this.$store.state.spin;
    },
    spinTarget() {
      return this.$store.state.spinTarget;
    },
    contestant() {
      return this.$store.state.players.find(
        (player: Player) => player.contestant
      );
    },
    expert() {
      return this.$store.state.players.find((player: Player) => player.expert);
    },
    segmentContent() {
      const { gameState, players, topics } = this.$store.state;
      if (gameState.mode === GameMode.PickTopic) {
        return topics;
      } else {
        return players.filter((player: Player) => !player.contestant);
      }
    },
    spinLength() {
      return SPIN_LENGTH;
    },
    pickExpert() {
      return this.$store.state.gameState.mode === GameMode.PickExpert;
    }
  },
  methods: {
    segmentColor(segment: Player, segmentIndex: number, segmentCount: number) {
      if (segment.expert) {
        return 'gold';
      } else if (segment.shutdown) {
        return 'red';
      } else {
        return `hsl(${360 * (segmentIndex / segmentCount)}, 100%, 80%)`;
      }
    },
    segmentTransform(segmentIndex: number, segmentCount: number) {
      return `rotate(${(360 / segmentCount) * segmentIndex}deg) skewY(${-(
        90 -
        360 / segmentCount
      )}deg)`;
    },
    segmentTextTransform(segmentCount: number) {
      return `skewY(${90 - 360 / segmentCount}deg) rotate(90deg)`;
    },
    setSegmentType(player: Player) {
      if (this.pickExpert) {
        this.$store.dispatch('setPlayerExpert', player.id);
      } else if (this.pickShutdown(player)) {
        this.$store.dispatch('setPlayerShutdown', player.id);
      }
    },
    pickShutdown(player: Player) {
      return (
        this.$store.state.gameState.mode === GameMode.PickShutdown &&
        player.id !== this.expert.id
      );
    }
  }
});
</script>

<style scoped>
#stage-wrapper {
  background: #192841;
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
.stage-segment {
  border: 2px solid white;
  position: absolute;
  top: -10vh;
  left: 45vh;
  width: 55vh;
  height: 55vh;
  transform: rotate(90deg);
  transform-origin: bottom left;
  transition: background-color 0.25s ease-in-out, transform 1s ease-in-out;
}
.stage-segment-interactive {
  cursor: pointer;
}
.stage-segment-pick-expert:hover {
  background: gold !important;
}
.stage-segment-pick-shutdown:hover {
  background: red !important;
}
.stage-segment-text {
  font-size: 1rem;
  font-size: 3vh;
  font-weight: bold;
  text-transform: uppercase;
  position: absolute;
  bottom: 43vh;
  color: white;
  user-select: none;
  text-shadow: 0px 0px 3px black;
  max-width: 40vh;
  transform-origin: bottom left;
}
.stage-center {
  left: 35vh;
  top: 35vh;
  height: 20vh;
  width: 20vh;
  background: #152238;
  position: absolute;
  border-radius: 100%;
  z-index: 1;
  color: white;
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
  background: white;
  position: absolute;
  border-bottom-left-radius: 1vh;
  border-bottom-right-radius: 1vh;
  pointer-events: none;
}
</style>
