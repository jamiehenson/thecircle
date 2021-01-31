<template>
  <div id="stage-wrapper">
    <div id="stage">
      <div
        id="stage-segments"
        :style="{
          transform: `rotate(${spinTarget}deg)`,
          transition: `${spin ? 'transform 5s ease-in-out' : ''}`
        }"
      >
        <div
          v-for="(segment, segmentIndex) in segmentContent"
          :key="segmentIndex"
          :style="{
            transform: `rotate(${
              (360 / segmentContent.length) * segmentIndex
            }deg) skewY(${-(90 - 360 / segmentContent.length)}deg)`,
            backgroundColor: `hsl(${
              360 * (segmentIndex / segmentContent.length)
            }, 100%, 50%)`
          }"
          class="stage-segment"
        >
          <span
            :style="{
              transform: `skewY(${
                90 - 360 / segmentContent.length
              }deg) rotate(90deg)`
            }"
            class="stage-segment-text"
          >
            {{ segment.name }}
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
    segmentContent() {
      const { gameState, players, topics } = this.$store.state;
      if (gameState.mode === GameMode.PickTopic) {
        return topics.slice(0, players.count);
      } else {
        return players.filter((player: Player) => !player.contestant);
      }
    },
    nonContestants() {
      return this.$store.state.players.filter(
        (player: Player) => !player.contestant
      );
    },
    expert() {
      return this.$store.state.players.find((player: Player) => player.expert);
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
  transition: background-color 1s ease-in-out;
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
  max-width: 25vh;
  text-align: right;
  transform-origin: bottom left;
}
.stage-center {
  left: 40vh;
  top: 40vh;
  height: 10vh;
  width: 10vh;
  background: black;
  position: absolute;
  border-radius: 100%;
  z-index: 1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vh;
  border: 2px solid white;
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
}
</style>
