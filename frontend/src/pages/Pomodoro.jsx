import PomodoroTimer from '../components/PomodoroTimer';

function Pomodoro() {
  return (
    <div className="max-w-2xl mx-auto py-2 sm:py-4">
      <div className="mb-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Pomodoro Timer</h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Stay focused with timed work sessions</p>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-10 border border-gray-100/50 shadow-sm">
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default Pomodoro;
