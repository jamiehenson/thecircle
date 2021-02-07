export interface State {
  mode: GameMode;
  nextMode: GameMode;
  players: Player[];
  selectedSegment?: number;
  showInfo: boolean;
  spin: boolean;
  spinTarget: number;
  started: boolean;
  topic?: Topic;
  topics: Topic[];
}

export interface Player {
  assistant: boolean;
  contestant: boolean;
  expert: boolean;
  id: number;
  name: string;
  score: number;
  shutdown: boolean;
}

export interface Topic {
  active: boolean;
  name: string;
  questions: Question[];
}

export enum GameMode {
  AnswerQuestion = 'ANSWER_QUESTION',
  PickAssistant = 'PICK_NON_CONTESTANT',
  PickContestant = 'PICK_CONTESTANT',
  PickExpert = 'PICK_EXPERT',
  PickShutdown = 'PICK_SHUTDOWN',
  PickTopic = 'PICK_TOPIC',
  Setup = 'SETUP'
}

export interface QuestionInput {
  answers: Answer[];
  question: string;
  topic: string;
}

export interface Answer {
  answer: string;
  correct?: boolean;
}

export interface Question extends QuestionInput {
  asked: boolean;
}

export interface QuestionObject {
  [index: string]: Question[];
}
