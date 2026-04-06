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
    <div className="flex flex-col items-center">
      
      {/* Session Settings */}
      <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-10 w-full bg-white border border-gray-100 shadow-sm rounded-3xl p-4 sm:p-6 lg:p-8 border-l-4 border-l-emerald-500">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">WORK SESSION</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="120"
              value={workMinutes}
              onChange={(e) => handleWorkChange(e.target.value)}
              disabled={isRunning}
              className="w-full bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-center text-sm font-bold border border-gray-100/50 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 disabled:opacity-30 transition-all font-mono"
            />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest sm:block hidden">MIN</span>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">BREAK TIME</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="60"
              value={breakMinutes}
              onChange={(e) => handleBreakChange(e.target.value)}
              disabled={isRunning}
              className="w-full bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-center text-sm font-bold border border-gray-100/50 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 disabled:opacity-30 transition-all font-mono"
            />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest sm:block hidden">MIN</span>
          </div>
        </div>
      </div>

      {/* Timer display */}
      <div className={`w-full max-w-lg text-center rounded-3xl sm:rounded-[3rem] border shadow-2xl px-6 py-12 sm:px-12 sm:py-16 transition-all duration-300 relative overflow-hidden group
      ${isBreak
          ? 'bg-emerald-50 border-emerald-100/50 shadow-emerald-700/5'
          : 'bg-white border-gray-50 shadow-gray-700/5'
        }`}>

          <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gray-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isBreak ? 'bg-emerald-400' : 'bg-emerald-600'
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>

        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] mb-6 sm:mb-8 transition-colors
        ${isBreak ? 'text-emerald-700' : 'text-gray-400'}
      `}>
          {isBreak ? 'BREAK_SESSION' : 'FOCUS_ENGAGED'}
        </p>

        <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 mb-10 sm:mb-12 tracking-tighter tabular-nums leading-none">
          {display}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-sm mx-auto">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-3.5 sm:px-10 sm:py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-700/20 active:scale-95 flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-widest"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              RESUME
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-3.5 sm:px-10 sm:py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-widest"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              PAUSE
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3.5 sm:px-10 sm:py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-widest"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
            RESET
          </button>
        </div>
      </div>

      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-10 font-bold uppercase tracking-[0.3em] flex items-center gap-4">
        <span>STRAT: {workMinutes}–{breakMinutes}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></span>
        <span>CONFIG_OK</span>
      </p>
    </div>
  );
}

export default PomodoroTimer;
