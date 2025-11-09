"use client"
import { Chrome } from "lucide-react"

interface RobotCheckboxProps {
  isVerified: boolean
  onNotRobotClick: () => void
}

export default function RobotCheckbox({ isVerified, onNotRobotClick }: RobotCheckboxProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer transition-all ${
              isVerified ? "border-blue-500 bg-white" : "border-slate-300 hover:border-slate-400"
            }`}
            onClick={onNotRobotClick}
            role="checkbox"
            aria-checked={isVerified}
            tabIndex={0}
          >
            {isVerified && (
              <svg
                className="w-4 h-4 text-blue-500 animate-scale-in animate-stroke-dash"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-slate-900 font-medium">I'm not a robot</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Chrome className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-600">reCAPTCHA</div>
            <div className="text-[10px] text-slate-500">Powered by At410</div>
          </div>
        </div>
      </div>
    </div>
  )
}
