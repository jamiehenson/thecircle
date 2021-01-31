import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { GameMode, Player, State } from './types';

export const key: InjectionKey<Store<State>> = Symbol();

const spinLength = 5000;

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

let testTopics = [
  'General Knowledge',
  'Food and Drink',
  'Music',
  'Film',
  'Geography',
  'Sports',
  'News',
  'Netflix',
  'Anagrams',
  'Animals',
  'Football'
];

const chooseName = () => {
  const chosen = testNames[Math.floor(Math.random() * testNames.length)];
  testNames.splice(testNames.indexOf(chosen), 1);
  return chosen;
};

const chooseTestTopic = () => {
  const chosen = testTopics[Math.floor(Math.random() * testTopics.length)];
  testTopics.splice(testTopics.indexOf(chosen), 1);
  return chosen;
};

const initialPlayer = {
  contestant: false,
  assistant: false,
  expert: false,
  shutdown: false
};

const initialTopic = {
  active: false,

  questions: []
};

export const gameModeLabels = {
  [GameMode.Setup]: 'THE CIRCLE',
  [GameMode.PickTopic]: 'Pick Topic',
  [GameMode.PickContestant]: 'Pick Contestant',
  [GameMode.PickAssistant]: 'Pick Assistant',
  [GameMode.AnswerQuestion]: 'Answer Question'
};

export const store = createStore<State>({
  state() {
    return {
      players: [
        { ...initialPlayer, name: chooseName() },
        { ...initialPlayer, name: chooseName() },
        { ...initialPlayer, name: chooseName() }
      ],
      topics: [],
      spin: false,
      spinTarget: 0,
      gameState: {
        mode: GameMode.Setup,
        nextMode: GameMode.PickContestant,
        showInfo: true
      }
    };
  },
  mutations: {
    goToSetup(state) {
      state.gameState = {
        mode: GameMode.Setup,
        nextMode: GameMode.PickContestant,
        showInfo: true
      };
    },
    goToPickContestant(state) {
      const players = state.players.map((player) => ({
        ...player,
        contestant: false,
        expert: false,
        shutdown: false,
        assistant: false
      }));
      state.players = players;
      state.gameState = {
        mode: GameMode.PickContestant,
        nextMode: GameMode.PickTopic,
        showInfo: true
      };
    },
    goToPickTopic(state) {
      const players = state.players.map((player, index) => ({
        ...player,
        contestant: index === state.selectedSegment
      }));
      state.players = players;
      state.gameState = {
        mode: GameMode.PickTopic,
        nextMode: GameMode.PickAssistant,
        showInfo: true
      };
    },
    goToPickAssistant(state) {
      const topics = state.topics.map((topic, index) => ({
        ...topic,
        active: index === state.selectedSegment
      }));
      state.topics = topics;
      state.gameState = {
        mode: GameMode.PickAssistant,
        nextMode: GameMode.AnswerQuestion,
        showInfo: true
      };
    },
    goToAnswerQuestion(state) {
      state.players
        .filter((player: Player) => !player.contestant)
        .forEach(
          (player, index) =>
            (player.assistant = index === state.selectedSegment)
        );
      state.gameState = {
        mode: GameMode.AnswerQuestion,
        nextMode: GameMode.AnswerQuestion,
        showInfo: true
      };
    },
    spin(state) {
      state.spin = true;
      const newSpinTarget = Math.floor(Math.random() * 360 + 720);
      state.spinTarget = newSpinTarget;
    },
    increasePlayers(state) {
      if (state.players.length < 10) {
        state.players.push({
          ...initialPlayer,
          name: chooseName()
        });
      }
    },
    decreasePlayers(state) {
      if (state.players.length > 4) {
        state.players = state.players.slice(0, state.players.length - 1);
      }
    },
    closeInfo(state) {
      state.gameState.showInfo = false;
    }
  },
  actions: {
    changeGameMode({ commit }, mode) {
      switch (mode) {
        case GameMode.Setup:
          commit('goToSetup');
          break;
        case GameMode.PickContestant:
          commit('goToPickContestant');
          break;
        case GameMode.PickAssistant:
          commit('goToPickAssistant');
          break;
        case GameMode.PickTopic:
          commit('goToPickTopic');
          break;
        case GameMode.AnswerQuestion:
          commit('goToAnswerQuestion');
          break;
      }
    },
    spinAndAdvance({ commit, dispatch, state }) {
      commit('spin');
      commit('closeInfo');

      setTimeout(() => {
        state.spin = false;
        state.spinTarget = state.spinTarget % 360;

        const playerCount =
          state.players.find((player) => player.contestant) &&
          state.gameState.mode !== GameMode.PickTopic
            ? state.players.length - 1
            : state.players.length;

        const segmentAngle = 360 / playerCount;
        state.selectedSegment =
          (playerCount -
            Math.floor(
              (state.spinTarget - (180 - segmentAngle)) / segmentAngle
            )) %
          playerCount;

        dispatch('changeGameMode', state.gameState.nextMode);
      }, spinLength);
    }
  }
});
