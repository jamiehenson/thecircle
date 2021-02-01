import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import {
  DEFAULT_PLAYER_COUNT,
  MAX_PLAYERS,
  MIN_PLAYERS,
  playerSetup,
  SPIN_LENGTH,
  topicSetup
} from './helpers';
import { GameMode, Player, State } from './types';

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
        nextMode: GameMode.PickExpert,
        showInfo: true
      };
    },
    goToPickExpert(state) {
      const topics = state.topics.map((topic, index) => ({
        ...topic,
        active: index === state.selectedSegment
      }));
      state.topics = topics;

      state.gameState = {
        mode: GameMode.PickExpert,
        nextMode: GameMode.PickShutdown,
        showInfo: true
      };
    },
    goToPickShutdown(state) {
      state.gameState = {
        mode: GameMode.PickShutdown,
        nextMode: GameMode.PickAssistant,
        showInfo: true
      };
    },
    goToPickAssistant(state) {
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

        const { players, gameState } = state;

        const playerCount =
          players.find((player) => player.contestant) &&
          gameState.mode !== GameMode.PickTopic
            ? players.length - 1
            : players.length;

        const segmentAngle = 360 / playerCount;
        state.selectedSegment =
          (playerCount -
            Math.floor(
              (state.spinTarget - (180 - segmentAngle)) / segmentAngle
            )) %
          playerCount;

        dispatch('changeGameMode', gameState.nextMode);
      }, SPIN_LENGTH);
    },
    setPlayerExpert({ dispatch, state }, id) {
      const targetPlayer = state.players.find(
        (player: Player) => player.id === id
      );
      if (targetPlayer) {
        targetPlayer.expert = true;
      }

      dispatch('changeGameMode', state.gameState.nextMode);
    },
    setPlayerShutdown({ dispatch, state }, id) {
      const targetPlayer = state.players.find(
        (player: Player) => player.id === id
      );
      if (targetPlayer) {
        targetPlayer.shutdown = true;
      }

      dispatch('changeGameMode', state.gameState.nextMode);
    }
  }
});
