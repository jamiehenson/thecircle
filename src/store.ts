import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

// define your typings for the store state
export interface State {
  players: { name: string }[];
  experts: number[];
  contestant: number;
  spin: boolean;
  spinTarget: number;
  selectedSegment?: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const testNames = [
  'Galina',
  'Rolando',
  'Gilbert',
  'Anjanette',
  'Antonietta',
  'Mirta',
  'Burl',
  'Miles',
  'Jenelle',
  'Anitra',
  'Donya',
  'Galen',
  'Lesley',
  'Junko',
  'Latosha',
  'Joel',
  'Wilfred',
  'Lecia',
  'Kelvin',
  'Desiree'
];

export const store = createStore<State>({
  state() {
    return {
      players: [
        { name: testNames[Math.floor(Math.random() * testNames.length)] },
        { name: testNames[Math.floor(Math.random() * testNames.length)] },
        { name: testNames[Math.floor(Math.random() * testNames.length)] },
        { name: testNames[Math.floor(Math.random() * testNames.length)] }
      ],
      experts: [],
      contestant: 0,
      spin: false,
      spinTarget: 0
    };
  },
  mutations: {
    spin(state) {
      state.spin = true;
      const newSpinTarget = Math.floor(Math.random() * 360 + 720);
      state.spinTarget = newSpinTarget;
      setTimeout(() => {
        state.spin = false;
        state.spinTarget = newSpinTarget % 360;

        const expertCount = state.experts.length;

        const segmentAngle = 360 / expertCount;
        state.selectedSegment =
          (expertCount -
            Math.floor(
              (state.spinTarget - (180 - segmentAngle)) / segmentAngle
            )) %
          expertCount;
      }, 5000);
    },
    increasePlayers(state) {
      if (state.players.length < 8) {
        state.players.push({
          name: testNames[Math.floor(Math.random() * testNames.length)]
        });
      }

      //@ts-ignore
      this.commit('randomiseBoard');
    },
    decreasePlayers(state) {
      if (state.players.length > 4) {
        state.players = state.players.slice(0, state.players.length - 1);
      }

      //@ts-ignore
      this.commit('randomiseBoard');
    },
    randomiseBoard(state) {
      const { players } = state;
      const chosen = players[Math.floor(Math.random() * players.length)];
      let newExperts: number[] = [];

      players.forEach((player, index) => {
        if (player === chosen) {
          state.contestant = index;
        } else {
          newExperts.push(index);
        }
      });

      state.experts = newExperts;
    }
  }
});
