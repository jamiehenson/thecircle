import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface Player {
  name: string;
  contestant: boolean;
  expert: boolean;
  shutdown: boolean;
}

enum QuestionTopic {
  Topic1,
  Topic2,
  Topic3
}

interface Question {
  topic: QuestionTopic;
  expertPlayer: Player;
  shutdownPlayer: Player;
  answers: {
    answer: string;
    correct: boolean;
  };
}

export interface State {
  players: Player[];
  spin: boolean;
  spinTarget: number;
  selectedSegment?: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

let testNames = [
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

const chooseName = () => {
  const chosen = testNames[Math.floor(Math.random() * testNames.length)];
  testNames.splice(testNames.indexOf(chosen), 1);
  return chosen;
};

const initialPlayer = {
  contestant: false,
  expert: false,
  shutdown: false
};

export const store = createStore<State>({
  state() {
    return {
      players: [
        { ...initialPlayer, name: chooseName() },
        { ...initialPlayer, name: chooseName() },
        { ...initialPlayer, name: chooseName() },
        { ...initialPlayer, name: chooseName() }
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

        const playerCount = state.players.find((player) => player.contestant)
          ? state.players.length - 1
          : state.players.length;

        const segmentAngle = 360 / playerCount;
        state.selectedSegment =
          (playerCount -
            Math.floor(
              (state.spinTarget - (180 - segmentAngle)) / segmentAngle
            )) %
          playerCount;
      }, 5000);
    },
    increasePlayers(state) {
      if (state.players.length < 10) {
        state.players.push({
          ...initialPlayer,
          name: chooseName()
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

      state.players = players.map((player) => {
        if (player === chosen) {
          player.contestant = true;
        }
        return player;
      });
    }
  }
});
