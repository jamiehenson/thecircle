import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

// define your typings for the store state
export interface State {
  players: { name: string }[];
  spin: boolean;
  spinTarget: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    return {
      players: [
        { name: 'Player 1' },
        { name: 'Player 2' },
        { name: 'Player 3' }
      ],
      spin: false,
      spinTarget: 0
    };
  },
  mutations: {
    spin(state) {
      state.spin = true;
      state.spinTarget = Math.floor(Math.random() * 360 + 540);
      setTimeout(() => {
        state.spin = false;
      }, 5000);
    },
    increasePlayers(state) {
      if (state.players.length < 7) {
        state.players.push({ name: 'Player ' + (state.players.length + 1) });
      }
    },
    decreasePlayers(state) {
      if (state.players.length > 3) {
        state.players = state.players.slice(0, state.players.length - 1);
      }
    }
  }
});
