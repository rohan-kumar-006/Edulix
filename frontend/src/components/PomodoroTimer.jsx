import { useState, useEffect, useRef } from 'react';

function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    // when timer hits zero
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(workMinutes * 60);
      } else {
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, isBreak, workMinutes, breakMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  const handleWorkChange = (val) => {
    const num = Math.max(1, Math.min(120, Number(val) || 1));
    setWorkMinutes(num);
    if (!isRunning && !isBreak) {
      setTimeLeft(num * 60);
    }
  };

  const handleBreakChange = (val) => {
    const num = Math.max(1, Math.min(60, Number(val) || 1));
    setBreakMinutes(num);
    if (!isRunning && isBreak) {
      setTimeLeft(num * 60);
    }
  };

  const totalTime = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center py-6">

      <div className="flex items-center gap-8 mb-10 bg-white border border-gray-200 shadow-lg rounded-2xl px-2 py-1">

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Work
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={workMinutes}
            onChange={(e) => handleWorkChange(e.target.value)}
            disabled={isRunning}
            className="w-20 px-3 py-2 text-center text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50"
          />
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Break
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={breakMinutes}
            onChange={(e) => handleBreakChange(e.target.value)}
            disabled={isRunning}
            className="w-20 px-3 py-2 text-center text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className={`w-full max-w-md text-center rounded-3xl border shadow-xl px-10 py-12 transition-all duration-300
      ${isBreak
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-100'
        }`}>

        <p className={`text-xs font-semibold uppercase tracking-widest mb-4
        ${isBreak ? 'text-green-600' : 'text-gray-400'}
      `}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </p>

        <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isBreak ? 'bg-green-400' : 'bg-emerald-500'
              }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-7xl font-semibold text-gray-900 mb-10 tracking-tight tabular-nums">
          {display}
        </div>

        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-sm"
            >
              {timeLeft < totalTime ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-2.5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all shadow-sm"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-8 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        {workMinutes} min focus → {breakMinutes} min break
      </p>
    </div>
  );
}

export default PomodoroTimer;
