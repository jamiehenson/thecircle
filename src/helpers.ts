import {
  GameMode,
  Player,
  QuestionInput,
  QuestionObject,
  Topic
} from './types';

export const SPIN_LENGTH = 5000;
export const DEFAULT_PLAYER_COUNT = 4;
export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 4;

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

export const chooseName = (names: string[]) => {
  const chosen = names[Math.floor(Math.random() * names.length)];
  names.splice(names.indexOf(chosen), 1);
  return chosen;
};

export const chooseTestTopic = (names: string[]) => {
  const chosen = names[Math.floor(Math.random() * names.length)];
  names.splice(names.indexOf(chosen), 1);
  return chosen;
};

export const initialPlayer = {
  contestant: false,
  assistant: false,
  expert: false,
  shutdown: false,
  score: 0
};

export const initialTopic = {
  active: false,
  questions: []
};

export const playerSetup = (defaultPlayerCount = 4): Player[] => {
  const localNames = [...testNames];
  return [...Array(defaultPlayerCount).keys()].map((key) => ({
    ...initialPlayer,
    id: key + 1,
    name: chooseName(localNames)
  }));
};

export const topicSetup = (defaultPlayerCount = 4): Topic[] => {
  const localTopics = [...testTopics];
  return [...Array(defaultPlayerCount).keys()].map((key) => ({
    ...initialTopic,
    id: key + 1,
    name: chooseTestTopic(localTopics)
  }));
};

export const gameModeLabels = {
  [GameMode.Setup]: 'THE CIRCLE',
  [GameMode.PickTopic]: 'Pick Topic',
  [GameMode.PickContestant]: 'Pick Contestant',
  [GameMode.PickExpert]: 'Pick Expert',
  [GameMode.PickShutdown]: 'Pick Shutdown',
  [GameMode.PickAssistant]: 'Pick Assistant',
  [GameMode.AnswerQuestion]: 'Answer Question'
};

export const formatQuestions = (questions: QuestionInput[]) => {
  let questionObject: QuestionObject = {};

  questions.forEach((question) => {
    if (!questionObject[question.topic]) {
      questionObject[question.topic] = [];
    }

    questionObject[question.topic].push({ ...question, asked: false });
  });

  return questionObject;
};
