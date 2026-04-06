import PomodoroTimer from '../components/PomodoroTimer';

function Pomodoro() {
  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Pomodoro Timer</h1>
        <p className="text-sm text-muted mt-1">Stay focused with timed work sessions</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-border shadow-card">
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default Pomodoro;
