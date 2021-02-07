import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import {
  DEFAULT_PLAYER_COUNT,
  formatQuestions,
  MAX_PLAYERS,
  MIN_PLAYERS,
  playerSetup,
  SPIN_LENGTH,
  topicSetup
} from './helpers';
import questions from './lib/test-question-schema.json';
import { GameMode, Player, State, Topic } from './types';

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    const initialPlayers = playerSetup(DEFAULT_PLAYER_COUNT);
    const initialTopics = topicSetup(DEFAULT_PLAYER_COUNT);
    return {
      players: initialPlayers,
      topics: initialTopics,
      spin: false,
      spinTarget: 0,
      mode: GameMode.Setup,
      nextMode: GameMode.PickContestant,
      showInfo: true,
      started: false,
      questions: formatQuestions(questions)
    };
  },
  mutations: {
    goToSetup(state) {
      state.mode = GameMode.Setup;
      state.nextMode = GameMode.PickContestant;
      state.showInfo = true;
    },
    goToPickContestant(state) {
      const players = state.players.map((player) => ({
        ...player,
        contestant: false,
        assistant: false,
        expert: false,
        shutdown: false
      }));

      state.players = players;
      state.mode = GameMode.PickContestant;
      state.nextMode = GameMode.PickTopic;
      state.showInfo = true;
      state.started = true;
    },
    goToPickTopic(state) {
      const existingContestant = state.players.find(
        (player) => player.contestant
      );

      state.topics.forEach((topic) => (topic.active = false));

      const players = state.players.map((player, index) => ({
        ...player,
        contestant: existingContestant
          ? player === existingContestant
          : index === state.selectedSegment,
        expert: false,
        shutdown: false,
        assistant: false
      }));

      state.players = players;
      state.mode = GameMode.PickTopic;
      state.nextMode = GameMode.PickExpert;
      state.showInfo = true;
    },
    goToPickExpert(state) {
      const topics = state.topics.map((topic, index) => ({
        ...topic,
        active: index === state.selectedSegment
      }));

      state.topics = topics;
      state.topic = topics.find((topic) => topic.active);
      state.mode = GameMode.PickExpert;
      state.nextMode = GameMode.PickShutdown;
      state.showInfo = true;
    },
    goToPickShutdown(state) {
      state.mode = GameMode.PickShutdown;
      state.nextMode = GameMode.PickAssistant;
      state.showInfo = true;
    },
    goToPickAssistant(state) {
      state.mode = GameMode.PickAssistant;
      state.nextMode = GameMode.AnswerQuestion;
      state.showInfo = true;
    },
    goToAnswerQuestion(state) {
      state.players
        .filter((player: Player) => !player.contestant)
        .forEach(
          (player, index) =>
            (player.assistant = index === state.selectedSegment)
        );

      state.mode = GameMode.AnswerQuestion;
      state.nextMode = GameMode.AnswerQuestion;
      state.showInfo = true;
    },
    spin(state) {
      state.spin = true;
      const newSpinTarget = Math.floor(Math.random() * 360 + 720);
      state.spinTarget = newSpinTarget;
    },
    increasePlayers(state) {
      if (state.players.length < MAX_PLAYERS) {
        const newPlayerCount = state.players.length + 1;
        state.players = playerSetup(newPlayerCount);
        state.topics = topicSetup(newPlayerCount);
      }
    },
    decreasePlayers(state) {
      if (state.players.length > MIN_PLAYERS) {
        const newPlayerCount = state.players.length - 1;
        state.players = playerSetup(newPlayerCount);
        state.topics = topicSetup(newPlayerCount);
      }
    },
    closeInfo(state) {
      state.showInfo = false;
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
        case GameMode.PickExpert:
          commit('goToPickExpert');
          break;
        case GameMode.PickShutdown:
          commit('goToPickShutdown');
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

        const { players, mode, nextMode } = state;

        const playerCount =
          players.find((player) => player.contestant) &&
          mode !== GameMode.PickTopic
            ? players.length - 1
            : players.length;

        const segmentAngle = 360 / playerCount;
        state.selectedSegment =
          (playerCount -
            Math.floor(
              (state.spinTarget - (180 - segmentAngle)) / segmentAngle
            )) %
          playerCount;

        dispatch('changeGameMode', nextMode);
      }, SPIN_LENGTH);
    },
    setPlayerExpert({ dispatch, state }, id) {
      const targetPlayer = state.players.find(
        (player: Player) => player.id === id
      );
      if (targetPlayer) {
        targetPlayer.expert = true;
      }

      dispatch('changeGameMode', state.nextMode);
    },
    setPlayerShutdown({ dispatch, state }, id) {
      const targetPlayer = state.players.find(
        (player: Player) => player.id === id
      );
      if (targetPlayer) {
        targetPlayer.shutdown = true;
      }

      dispatch('changeGameMode', state.nextMode);
    },
    removeTopicFromPlay({ state }, targetTopic) {
      state.topics = state.topics.filter((topic) => topic !== targetTopic);
    },
    goToNextQuestion({ state, dispatch }) {
      const contestant = state.players.find(
        (player: Player) => player.contestant
      );

      const assistant = state.players.find(
        (player: Player) => player.assistant
      );

      const increment = assistant?.expert ? 2000 : 1000;

      if (contestant) {
        contestant.score += increment;
      }

      state.topics = state.topics.filter((topic) => topic !== state.topic);

      dispatch('changeGameMode', GameMode.PickTopic);
    }
  },
  getters: {
    getContestant(state) {
      return state.players.find((player: Player) => player.contestant);
    },
    getExpert(state) {
      return state.players.find((player: Player) => player.expert);
    },
    getShutdown(state) {
      return state.players.find((player: Player) => player.shutdown);
    },
    getAssistant(state) {
      return state.players.find((player: Player) => player.assistant);
    },
    getTopic(state) {
      return state.topics.find((topic: Topic) => topic.active);
    }
  }
});
