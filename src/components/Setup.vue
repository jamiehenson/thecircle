<template>
  <div id="setup-box">
    <p class="player-control">
      Number of players: {{ players.length }}
      <span @click="increasePlayers">+</span>
      <span @click="decreasePlayers">-</span>
    </p>
    <div v-for="(player, playerIndex) in players" :key="playerIndex">
      <input v-model="player.name" maxlength="15" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Setup',
  computed: {
    players() {
      return this.$store.state.players;
    }
  },
  methods: {
    increasePlayers() {
      this.$store.commit('increasePlayers');
    },
    decreasePlayers() {
      this.$store.commit('decreasePlayers');
    }
  }
});
</script>

<style scoped>
#setup-box {
  background-color: var(--blue3);
  padding: 3vh;
  border-radius: 1vh;
}
.player-control {
  font-size: 3vh;
  font-weight: bold;
  margin: 0;
  user-select: none;
}
.player-control span {
  cursor: pointer;
  opacity: 0.6;
  padding: 1vh;
  transition: opacity 0.2s ease-in-out;
}
.player-control span:hover {
  opacity: 1;
}
input {
  font-size: 2vh;
  padding: 1vh;
  width: 100%;
  border-radius: 1vh;
  box-sizing: border-box;
  border: 0;
  margin-top: 2vh;
  text-align: center;
  font-weight: bold;
  font-family: Avenir, Helvetica, sans-serif;
}
h2 {
  margin-top: 0;
}
</style>
