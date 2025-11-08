"use client"

import { useState } from "react"
import RobotCheckbox from "@/components/captcha/robot-checkbox"
import PuzzleVerification from "@/components/captcha/puzzle-verification"

export default function Home() {
  const [isVerified, setIsVerified] = useState(false)
  const [showPuzzle, setShowPuzzle] = useState(false)

  const handleNotRobotClick = () => {
    setShowPuzzle(true)
  }

  const handlePuzzleComplete = () => {
    setIsVerified(true)
    setShowPuzzle(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!showPuzzle ? (
          <RobotCheckbox isVerified={isVerified} onNotRobotClick={handleNotRobotClick} />
        ) : (
          <PuzzleVerification onComplete={handlePuzzleComplete} />
        )}
      </div>
    </main>
  )
}
