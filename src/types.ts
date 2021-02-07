export interface State {
  finalQuestion: boolean;
  mode: GameMode;
  nextMode: GameMode;
  players: Player[];
  questions: QuestionObject;
  selectedSegment?: number;
  showCredits: boolean;
  showInfo: boolean;
  spin: boolean;
  spinTarget: number;
  topics: Topic[];
}

export interface Player {
  assistanceScore: number;
  assistant: boolean;
  contestant: boolean;
  expert: boolean;
  finalRoundPlayed: boolean;
  id: number;
  name: string;
  score: number;
  scoreMultiplier?: number;
  shutdown: boolean;
}

export interface Topic {
  active: boolean;
  name: string;
  questions: Question[];
}

export enum GameMode {
  AnswerQuestion = 'ANSWER_QUESTION',
  EndGame = 'END_GAME',
  PickAssistant = 'PICK_ASSISTANT',
  PickContestant = 'PICK_CONTESTANT',
  PickExpert = 'PICK_EXPERT',
  PickFinalAssistant = 'PICK_GOLDEN_ASSISTANT',
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
