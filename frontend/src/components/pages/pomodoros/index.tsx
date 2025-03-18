import PomodoroHeader from "./header";
import { PomodoroTimer } from "./PomodoroTimer";

export default function Pomodoro() {
  return (
    <main className="flex flex-col h-[calc(100vh-20px)]">
      <PomodoroHeader />
      <section className="bg-muted rounded-lg h-full">
        <PomodoroTimer />
      </section>
    </main>
  );
}
