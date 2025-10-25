export interface PeriodConfig {
  period: number
  startUid: number
  endUid: number
  totalCount: number
}

export const gameConfig = {
  // 每次猜测提供的选项数量
  optionsCount: 6,

  // 各期工程配置
  periods: [
    {
      period: 1,
      startUid: 1,
      endUid: 60,
      totalCount: 60,
    },
    {
      period: 2,
      startUid: 61,
      endUid: 100,
      totalCount: 40,
    },
  ] as PeriodConfig[],

  // 图片URL模板
  eyeImageUrlTemplate: "https://zh.yuazhi.cn/at410/eye/[PID].jpg",
  fullImageUrlTemplate: "https://zh.yuazhi.cn/at410/eye/answer/[APID].jpg",
}

// 获取总的UID范围
export function getTotalUidRange() {
  const periods = gameConfig.periods
  const minUid = Math.min(...periods.map((p) => p.startUid))
  const maxUid = Math.max(...periods.map((p) => p.endUid))
  return { minUid, maxUid }
}

// 根据UID获取对应的期数配置
export function getPeriodByUid(uid: number): PeriodConfig | null {
  return gameConfig.periods.find((p) => uid >= p.startUid && uid <= p.endUid) || null
}

// 计算PID（用于眼睛图片）
export function calculatePID(uid: number): string | null {
  const period = getPeriodByUid(uid)
  if (!period) return null

  const offset = uid - period.startUid + 1
  return `${period.period}-${offset}`
}

// 计算APID（用于完整图片）
export function calculateAPID(uid: number): string | null {
  const period = getPeriodByUid(uid)
  if (!period) return null

  const offset = uid - period.startUid + 1
  return `${period.period}d-${offset}`
}
