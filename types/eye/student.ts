export interface Student {
  name: string
  number: number
}

export interface GameState {
  currentUid: number
  currentRound: number
  totalRounds: number
  score: number
  history: GameHistory[]
  usedUids: number[]
}

export interface GameHistory {
  uid: number
  eyeImageUrl: string
  fullImageUrl: string
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean
  options: string[]
}
