import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import {
  DEFAULT_PLAYER_COUNT,
  formatQuestions,
  getActiveWheelPlayers,
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
      questions: formatQuestions(questions),
      finalQuestion: false
    };
  },
  mutations: {
    goToSetup(state) {
      state.mode = GameMode.Setup;
      state.nextMode = GameMode.PickContestant;
      state.showInfo = true;
      state.finalQuestion = false;
    },
    goToPickContestant(state) {
      const players = state.players.map((player) => ({
        ...player,
        contestant: false,
        assistant: false,
        expert: false,
        shutdown: false
      }));

      state.topics.forEach((topic) => (topic.active = false));

      state.players = players;
      state.mode = GameMode.PickContestant;
      state.nextMode = GameMode.PickTopic;
      state.showInfo = true;
    },
    goToPickTopic(state) {
      // const existingContestant = state.players.find((player) => player.contestant);

      state.topics.forEach((topic) => (topic.active = false));

      const activeWheelPlayerIds = getActiveWheelPlayers(state.players).map(({ id }: Player) => id);

      state.players = state.players.map((player: Player) => {
        if (activeWheelPlayerIds.includes(player.id)) {
          return {
            ...player,
            contestant: activeWheelPlayerIds.indexOf(player.id) === state.selectedSegment,
            expert: false,
            shutdown: false,
            assistant: false
          };
        } else {
          return player;
        }
      });

      state.mode = GameMode.PickTopic;

      if (state.finalQuestion) {
        state.topics = topicSetup(4);
        state.nextMode = GameMode.PickFinalAssistant;
      } else {
        state.nextMode = GameMode.PickExpert;
      }
      state.showInfo = true;
    },
    goToPickExpert(state) {
      const players = state.players.map((player) => ({
        ...player,
        expert: false,
        shutdown: false,
        assistant: false
      }));

      if (state.topics.length > 1) {
        state.topics = state.topics.map((topic, index) => ({
          ...topic,
          active: index === state.selectedSegment
        }));
      }

      state.players = players;
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
      state.mode = GameMode.AnswerQuestion;
      state.nextMode = GameMode.AnswerQuestion;
      state.showInfo = true;
    },
    goToPickFinalAssistant(state) {
      state.mode = GameMode.PickFinalAssistant;
      state.nextMode = GameMode.AnswerQuestion;
      state.showInfo = true;
    },
    goToEndGame(state) {
      state.mode = GameMode.EndGame;
      state.nextMode = GameMode.Setup;
    },
    spin(state) {
      state.spin = true;
      const newSpinTarget = Math.floor(Math.random() * 540 + 720);
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
    changeGameMode({ commit, dispatch }, mode) {
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
          dispatch('answerQuestionOrPickContestant');
          break;
        case GameMode.PickFinalAssistant:
          commit('goToPickFinalAssistant');
          break;
        case GameMode.EndGame:
          commit('goToEndGame');
          break;
      }
    },
    spinAndAdvance({ commit, dispatch, state }) {
      commit('spin');
      commit('closeInfo');

      setTimeout(() => {
        state.spin = false;
        state.spinTarget = state.spinTarget % 360;

        const { players, topics, mode, nextMode } = state;

        let segmentCount = 0;
        if (mode === GameMode.PickTopic) {
          segmentCount = topics.length;
        } else {
          segmentCount = getActiveWheelPlayers(players).length;
        }

        const segmentAngle = 360 / segmentCount;
        state.selectedSegment =
          (segmentCount - Math.floor((state.spinTarget - (180 - segmentAngle)) / segmentAngle)) % segmentCount;

        dispatch('changeGameMode', nextMode);
      }, SPIN_LENGTH);
    },
    setPlayerExpert({ dispatch, state }, id) {
      const targetPlayer = state.players.find((player: Player) => player.id === id);
      if (targetPlayer) {
        targetPlayer.expert = true;
      }

      dispatch('changeGameMode', state.nextMode);
    },
    setPlayerShutdown({ dispatch, state }, id) {
      const targetPlayer = state.players.find((player: Player) => player.id === id);
      if (targetPlayer) {
        targetPlayer.shutdown = true;
      }

      dispatch('changeGameMode', state.nextMode);
    },
    removeTopicFromPlay({ state }, targetTopic) {
      state.topics = state.topics.filter((topic) => topic !== targetTopic);
    },
    goToNextQuestion({ state, dispatch, getters }) {
      const contestant = getters.getContestant;
      const assistant = getters.getAssistant;
      const increment = assistant?.expert ? 2000 : 1000;

      contestant.score += increment;
      assistant.assistanceScore += 1;

      const newTopics = state.topics.filter((topic) => !topic.active);

      if (newTopics.length === 0) {
        state.finalQuestion = true;
        dispatch('changeGameMode', GameMode.PickTopic);
      } else if (newTopics.length === 1) {
        state.topics = [{ ...newTopics[0], active: true }];
        dispatch('changeGameMode', GameMode.PickExpert);
      } else {
        state.topics = newTopics;
        dispatch('changeGameMode', GameMode.PickTopic);
      }
    },
    answerQuestionOrPickContestant({ state, commit, getters }) {
      state.players
        .filter((player: Player) => !player.contestant)
        .forEach((player, index) => (player.assistant = index === state.selectedSegment));

      if (getters.getAssistant?.shutdown) {
        commit('goToPickContestant');
      } else {
        commit('goToAnswerQuestion');
      }
    },
    pickFinalAssistant({ state }, assistant) {
      state.players = state.players.map((player: Player) => ({
        ...player,
        assistant: player.id === assistant.id,
        scoreMultiplier: assistant.scoreMultiplier
      }));

      this.commit('goToAnswerQuestion');
    },
    playerHasAttemptedFinalQuestion({ state }, contestant) {
      const targetPlayer = state.players.find((player: Player) => player.id === contestant.id);

      if (targetPlayer) {
        targetPlayer.finalRoundPlayed = true;
      }
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
    },
    getTopicNames(state) {
      return Object.keys(state.questions);
    },
    getNonContestants(state) {
      return state.players.filter((player: Player) => !player.contestant);
    }
  }
});
