import PomodoroTimer from '../components/PomodoroTimer';

function Pomodoro() {
  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8">
      <div className="mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Pomodoro Timer</h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Stay focused with timed work sessions</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100/50 shadow-sm">
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default Pomodoro;
