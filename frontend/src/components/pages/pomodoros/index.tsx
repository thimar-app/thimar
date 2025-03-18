import PomodoroHeader from "./header";
import { PomodoroTimer } from "./PomodoroTimer";

export default function Pomodoro() {
  return (
    <main className="flex flex-col">
      <PomodoroHeader />
      <PomodoroTimer />
    </main>
  );
}
