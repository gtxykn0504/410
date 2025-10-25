import { students } from "./students"
import { getTotalUidRange, calculatePID, calculateAPID, gameConfig } from "./game-config"

// 生成随机的UID（不重复）
export function generateRandomUid(usedUids: number[]): number {
  const { minUid, maxUid } = getTotalUidRange()
  const availableUids = []

  for (let uid = minUid; uid <= maxUid; uid++) {
    if (!usedUids.includes(uid)) {
      availableUids.push(uid)
    }
  }

  if (availableUids.length === 0) {
    throw new Error("No more available UIDs")
  }

  const randomIndex = Math.floor(Math.random() * availableUids.length)
  return availableUids[randomIndex]
}

// 生成选项（包含正确答案和随机的其他选项）
export function generateOptions(correctAnswer: string): string[] {
  const options = [correctAnswer]
  const availableStudents = students.filter((s) => s.name !== correctAnswer)

  // 随机选择其他选项
  while (options.length < gameConfig.optionsCount && availableStudents.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableStudents.length)
    const student = availableStudents.splice(randomIndex, 1)[0]
    options.push(student.name)
  }

  // 打乱选项顺序
  return options.sort(() => Math.random() - 0.5)
}

// 获取眼睛图片URL
export function getEyeImageUrl(uid: number): string {
  const pid = calculatePID(uid)
  if (!pid) return ""
  return gameConfig.eyeImageUrlTemplate.replace("[PID]", pid)
}

// 获取完整图片URL
export function getFullImageUrl(uid: number): string {
  const apid = calculateAPID(uid)
  if (!apid) return ""
  return gameConfig.fullImageUrlTemplate.replace("[APID]", apid)
}

// 初始化游戏状态
export function initializeGame(totalRounds = 10) {
  const usedUids: number[] = []
  const currentUid = generateRandomUid(usedUids)
  usedUids.push(currentUid)

  return {
    currentUid,
    currentRound: 1,
    totalRounds,
    score: 0,
    history: [],
    usedUids,
  }
}
