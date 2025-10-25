import type { GameState } from "@/types/eye/student"

const STORAGE_KEY = "eye-game"

export function saveGameState(state: GameState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearGameState(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
