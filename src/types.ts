export interface State {
  players: Player[];
  spin: boolean;
  spinTarget: number;
  selectedSegment?: number;
  topics: Topic[];
  gameState: GameState;
}

export interface GameState {
  mode: GameMode;
  nextMode: GameMode;
  showInfo: boolean;
}

export interface Player {
  name: string;
  contestant: boolean;
  assistant: boolean;
  expert: boolean;
  shutdown: boolean;
}

export interface Topic {
  name: string;
  active: boolean;
  expert?: Player;
  shutdown?: Player;
  questions: Question[];
}

export enum GameMode {
  Setup = 'SETUP',
  PickContestant = 'PICK_CONTESTANT',
  PickTopic = 'PICK_TOPIC',
  PickAssistant = 'PICK_NON_CONTESTANT',
  AnswerQuestion = 'ANSWER_QUESTION'
}

export interface Question {
  topic: string;
  expertPlayer: Player;
  shutdownPlayer: Player;
  answers: {
    answer: string;
    correct: boolean;
  };
}
